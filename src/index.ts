import { createConnection } from "net";
import { resolveMx } from "dns/promises";
import { Cache } from "memory-cache";

const EMAIL_REGEX =
  /^([\w-]+(?:.[\w-]+))@((?:[\w-]+.)\w[\w-]{0,66}).([a-z]{2,6}(?:.[a-z]{2})?)$/i;

// Tạo một bộ nhớ cache với thời gian sống là 1 ngày
const dnsCache = new Cache();
const DNS_CACHE_TTL = 86400000;

export const validateEmail = (email: string) => {
  if (!email || email.length > 254) {
    return false;
  }

  return EMAIL_REGEX.test(email);
};

export const checkEmail = async (email: string) => {
  try {
    if (!validateEmail(email)) {
      return false;
    }

    const domain = email.split("@")[1];

    let records = [];
    records = dnsCache.get(domain) as [];
    if (!records) {
      records = await resolveMx(domain);
      dnsCache.put(domain, records, DNS_CACHE_TTL);
    }

    if (records.length === 0) {
      return false;
    }

    const sortedRecords = records.sort(
      (a: any, b: any) => a.priority - b.priority
    );
    const exchange = sortedRecords[0].exchange;

    const opts = {
      from: email,
      timeout: 3000,
      host: domain,
    };

    const conn = createConnection(25, exchange);

    const connPromise = new Promise((resolve, reject) => {
      let step = 0;

      const CONN = [
        `helo ${opts.host}\n`,
        `mail from: <${opts.from}>\n`,
        `rcpt to: <${opts.from}>\n`,
      ];

      conn.setTimeout(opts.timeout, () => {
        conn.destroy();
        reject(false);
      });

      conn.on("data", (data: any) => {
        if (data.toString().charAt(0) !== "2") {
          conn.destroy();
          reject(false);
        }

        if (step < 3) {
          conn.write(CONN[step], () => {
            step++;
          });
        } else {
          conn.destroy();
          resolve(true);
        }
      });

      conn.on("error", (err: any) => {
        conn.destroy();
        reject(false);
      });
    });

    const res = await connPromise;

    return res;
  } catch (error) {
    return false;
  }
};
