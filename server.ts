import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

interface NigerianBank {
  name: string;
  code: string;
}

const CURATED_NIGERIAN_BANKS: NigerianBank[] = [
  { name: 'Kuda Microfinance Bank', code: '50211' },
  { name: 'OPay Digital Services', code: '999992' },
  { name: 'PalmPay', code: '999991' },
  { name: 'Moniepoint Microfinance Bank', code: '50515' },
  { name: 'Access Bank', code: '044' },
  { name: 'Guaranty Trust Bank (GTBank)', code: '058' },
  { name: 'Zenith Bank', code: '057' },
  { name: 'First Bank of Nigeria', code: '011' },
  { name: 'United Bank for Africa (UBA)', code: '033' },
  { name: 'Fidelity Bank', code: '070' },
  { name: 'Stanbic IBTC Bank', code: '221' },
  { name: 'Wema Bank', code: '035' },
  { name: 'Sterling Bank', code: '232' },
  { name: 'Union Bank of Nigeria', code: '032' },
  { name: 'Ecobank Nigeria', code: '050' },
];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fetchLiveBanks(): Promise<{ source: string; banks: NigerianBank[] }> {
  const paystackKey = process.env.PAYSTACK_SECRET_KEY?.trim();
  if (paystackKey) {
    try {
      const response = await fetch(
        'https://api.paystack.co/bank?country=nigeria&perPage=100',
        {
          headers: {
            Authorization: `Bearer ${paystackKey}`,
          },
          signal: AbortSignal.timeout(6000),
        }
      );
      if (response.ok) {
        const json = (await response.json()) as {
          status?: boolean;
          data?: { name?: string; code?: string; active?: boolean }[];
        };
        if (json.status && Array.isArray(json.data)) {
          const banks = json.data
            .filter((b) => b.name && b.code && b.active !== false)
            .map((b) => ({ name: String(b.name), code: String(b.code) }));
          if (banks.length > 0) {
            return { source: 'paystack', banks };
          }
        }
      }
    } catch {
      // Fall through to next live bank directory source
    }
  }

  const flutterwaveKey = process.env.FLUTTERWAVE_SECRET_KEY?.trim();
  if (flutterwaveKey) {
    try {
      const response = await fetch('https://api.flutterwave.com/v3/banks/NG', {
        headers: {
          Authorization: `Bearer ${flutterwaveKey}`,
        },
        signal: AbortSignal.timeout(6000),
      });
      if (response.ok) {
        const json = (await response.json()) as {
          status?: string;
          data?: { name?: string; code?: string }[];
        };
        if (json.status === 'success' && Array.isArray(json.data)) {
          const banks = json.data
            .filter((b) => b.name && b.code)
            .map((b) => ({ name: String(b.name), code: String(b.code) }));
          if (banks.length > 0) {
            return { source: 'flutterwave', banks };
          }
        }
      }
    } catch {
      // Fall through to public directory
    }
  }

  try {
    const response = await fetch('https://nigerianbanks.xyz', {
      signal: AbortSignal.timeout(4500),
    });
    if (response.ok) {
      const json = (await response.json()) as { name?: string; code?: string }[];
      if (Array.isArray(json)) {
        const seen = new Set<string>();
        const merged: NigerianBank[] = [];
        for (const item of [...CURATED_NIGERIAN_BANKS, ...json]) {
          if (!item.name || !item.code) continue;
          const key = `${item.code}:${item.name.toLowerCase()}`;
          if (seen.has(key)) continue;
          seen.add(key);
          merged.push({ name: String(item.name), code: String(item.code) });
        }
        if (merged.length > 0) {
          return { source: 'nigerianbanks.xyz', banks: merged };
        }
      }
    }
  } catch {
    // Fall back to official CBN/NIP directory list
  }

  return { source: 'cbn-directory', banks: CURATED_NIGERIAN_BANKS };
}

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT) || 3000;

  app.use(express.json());

  app.get('/api/banks', async (_req: Request, res: Response) => {
    const result = await fetchLiveBanks();
    res.json(result);
  });

  app.get('/api/banks/resolve', async (req: Request, res: Response) => {
    const accountNumber = String(req.query.account_number ?? '').trim();
    const bankCode = String(req.query.bank_code ?? '').trim();

    if (!/^\d{10}$/.test(accountNumber)) {
      res.status(400).json({
        verified: false,
        error: 'Enter a valid 10-digit NUBAN account number.',
      });
      return;
    }

    if (!bankCode) {
      res.status(400).json({
        verified: false,
        error: 'Select a valid Nigerian bank.',
      });
      return;
    }

    const paystackKey = process.env.PAYSTACK_SECRET_KEY?.trim();
    if (paystackKey) {
      try {
        const url = `https://api.paystack.co/bank/resolve?account_number=${encodeURIComponent(
          accountNumber
        )}&bank_code=${encodeURIComponent(bankCode)}`;
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${paystackKey}`,
          },
          signal: AbortSignal.timeout(10000),
        });
        const payload = (await response.json()) as {
          status?: boolean;
          message?: string;
          data?: {
            account_number?: string;
            account_name?: string;
            bank_id?: number;
          };
        };

        if (response.ok && payload.status && payload.data?.account_name) {
          res.json({
            verified: true,
            provider: 'paystack',
            accountNumber: payload.data.account_number ?? accountNumber,
            accountName: payload.data.account_name,
            bankCode,
          });
          return;
        }

        res.status(response.status >= 400 ? response.status : 422).json({
          verified: false,
          provider: 'paystack',
          error:
            payload.message ||
            'Could not resolve account name. Check the bank and account number.',
        });
        return;
      } catch {
        res.status(502).json({
          verified: false,
          error: 'Unable to reach live Paystack verification service. Please try again.',
        });
        return;
      }
    }

    const flutterwaveKey = process.env.FLUTTERWAVE_SECRET_KEY?.trim();
    if (flutterwaveKey) {
      try {
        const response = await fetch(
          'https://api.flutterwave.com/v3/accounts/resolve',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${flutterwaveKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              account_number: accountNumber,
              account_bank: bankCode,
            }),
            signal: AbortSignal.timeout(10000),
          }
        );
        const payload = (await response.json()) as {
          status?: string;
          message?: string;
          data?: {
            account_number?: string;
            account_name?: string;
          };
        };

        if (
          response.ok &&
          payload.status === 'success' &&
          payload.data?.account_name
        ) {
          res.json({
            verified: true,
            provider: 'flutterwave',
            accountNumber: payload.data.account_number ?? accountNumber,
            accountName: payload.data.account_name,
            bankCode,
          });
          return;
        }

        res.status(response.status >= 400 ? response.status : 422).json({
          verified: false,
          provider: 'flutterwave',
          error:
            payload.message ||
            'Could not resolve account name. Check the bank and account number.',
        });
        return;
      } catch {
        res.status(502).json({
          verified: false,
          error:
            'Unable to reach live Flutterwave verification service. Please try again.',
        });
        return;
      }
    }

    const nubapiKey = process.env.NUBAPI_API_KEY?.trim();
    if (nubapiKey) {
      try {
        const url = `https://nubapi.com/api/verify?account_number=${encodeURIComponent(
          accountNumber
        )}&bank_code=${encodeURIComponent(bankCode)}`;
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${nubapiKey}`,
          },
          signal: AbortSignal.timeout(10000),
        });
        const payload = (await response.json()) as {
          account_name?: string;
          account_number?: string;
          message?: string;
          status?: boolean | string;
        };

        if (response.ok && payload.account_name) {
          res.json({
            verified: true,
            provider: 'nubapi',
            accountNumber: payload.account_number ?? accountNumber,
            accountName: payload.account_name,
            bankCode,
          });
          return;
        }

        res.status(response.status >= 400 ? response.status : 422).json({
          verified: false,
          provider: 'nubapi',
          error:
            payload.message ||
            'Could not resolve account name. Check the bank and account number.',
        });
        return;
      } catch {
        res.status(502).json({
          verified: false,
          error: 'Unable to reach live NubAPI verification service. Please try again.',
        });
        return;
      }
    }

    res.status(503).json({
      verified: false,
      code: 'LIVE_PROVIDER_NOT_CONFIGURED',
      error:
        'Live Nigerian NIBSS verification requires PAYSTACK_SECRET_KEY, FLUTTERWAVE_SECRET_KEY, or NUBAPI_API_KEY in your Secrets.',
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      const indexFile = path.join(distPath, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build output not found.');
      }
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`NairaX server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
