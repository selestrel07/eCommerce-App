// export default {
//   'src/**/*.{ts,tsx}': (stagedFiles) => {
//     const files = stagedFiles.join(' ');
//     return [`eslint ${files}`, `prettier --write ${files}`];
//   },
//   'src/**/*.css': (stagedFiles) => {
//     return [`prettier --write ${stagedFiles.join(' ')}`];
//   },
// };

import path from 'node:path';

export default {
  '**/*.{ts,tsx}': (files) => {
    const relativePaths = files.map((file) => path.relative(process.cwd(), file));
    return [
      `eslint --no-warn-ignored ${relativePaths.join(' ')}`,
      `prettier --write ${relativePaths.join(' ')}`,
    ];
  },
  '**/*.css': (files) => {
    const relativePaths = files.map((file) => path.relative(process.cwd(), file));
    return [`prettier --write ${relativePaths.join(' ')}`];
  },
};
