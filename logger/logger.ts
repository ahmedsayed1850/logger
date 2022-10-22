// this is the logger for the browser
import pino from "pino";
interface IPinoconfig {
  browser: {
    asObject: boolean;
    transmit?: {
      level: string;
      send: (level: any, logEvent: any) => void;
    };
  };
}

const config = {
  serverUrl: process.env.REACT_APP_API_PATH || "http://localhost:3000",
  env: process.env.NODE_ENV,
  publicUrl: process.env.PUBLIC_URL,
};

const pinoConfig: IPinoconfig = {
  browser: {
    asObject: true,
  },
};

if (config.serverUrl) {
  pinoConfig.browser.transmit = {
    level: "info",
    send: (level, logEvent) => {
      const msg = logEvent.messages[0];

      const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept",
        type: "application/json",
      };
      let blob = new Blob([JSON.stringify({ msg, level })], headers);
      navigator.sendBeacon(`${config.serverUrl}/log`, blob);
    },
  };
}

const logger = pino(pinoConfig);

export const log = (msg: any) => logger.info(msg);
export default logger;
