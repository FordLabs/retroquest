import * as React from 'react';

import { Contributor } from '../types/Contributor';

export default function (): Contributor[] {
  const [contributors, setContributors] = React.useState<Contributor[]>([]);

  React.useEffect(() => {
    // @ts-ignore
    global.fetch('/api/contributors').then((result) =>
      result.json().then((contributorArray) =>
        setContributors(
          contributorArray.map((contributor) => ({
            accountUrl: contributor.accountUrl,
            image: `data:image/png;base64,${contributor.image}`,
          }))
        )
      )
    );
  }, []);

  return contributors;
}
