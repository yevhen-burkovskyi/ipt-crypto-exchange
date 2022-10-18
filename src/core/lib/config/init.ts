import * as fs from 'fs';
import * as path from 'path';

import { ErrorMessagesEnum } from 'src/core/enums/error-messages.enum';
import { ConfigSchema } from 'src/core/lib/config/config.schema';

const nodeEnv = process.env.NODE_ENV;
const nodeConfigDir = process.env.NODE_CONFIG_DIR;
const files = fs.readdirSync(nodeConfigDir);
const confFile = files.filter((file) => file.endsWith(`${nodeEnv}.json`));
const configFilePath = `${nodeConfigDir}/${confFile}`;

export default () => {
  const config = JSON.parse(fs.readFileSync(path.join(configFilePath), 'utf8'));
  const result = ConfigSchema.validate(config, {
    allowUnknown: false,
    abortEarly: false,
  });
  if (result.error) {
    throw new Error(
      ErrorMessagesEnum.CONFIG + JSON.stringify(result.error.message),
    );
  }
  return config;
};
