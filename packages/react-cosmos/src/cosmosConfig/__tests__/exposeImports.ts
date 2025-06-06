// WARNING: Module mocks need to be imported before the mocked modules are
// imported, which are sometimes imported indirectly by the modules being
// tested. Otherwise the mocks will be applied too late and the tests will run
// against the unmocked original modules instead.
import { mockCliArgs, unmockCliArgs } from '../../testHelpers/mockYargs.js';

import { getCwdPath } from '../../testHelpers/cwd.js';
import { createCosmosConfig } from '../createCosmosConfig.js';

afterEach(async () => {
  await unmockCliArgs();
});

it('does not expose imports by default', () => {
  const config = createCosmosConfig(process.cwd());
  expect(config.exposeImports).toBe(false);
});

it('returns resolved user imports path', () => {
  const config = createCosmosConfig(process.cwd(), {
    exposeImports: 'src/myImports.ts',
  });
  expect(config.exposeImports).toBe(getCwdPath('src/myImports.ts'));
});

it('uses --exportImports CLI arg', async () => {
  await mockCliArgs({ exposeImports: true });

  const config = createCosmosConfig(process.cwd());
  expect(config.exposeImports).toBe(true);
});

it('resolves --exportImports CLI arg path', async () => {
  await mockCliArgs({ exposeImports: 'src/myImports.ts' });

  const config = createCosmosConfig(process.cwd());
  expect(config.exposeImports).toBe(getCwdPath('src/myImports.ts'));
});
