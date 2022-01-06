import { useEffect, useState } from 'react';
import axios from 'axios';

import { Contributor } from '../types/Contributor';

export default function (): Contributor[] {
  const [contributors, setContributors] = useState<Contributor[]>([]);

  useEffect(() => {
    axios.get('/api/contributors').then((response) => {
      const contributorArray = response.data;
      setContributors(
        contributorArray.map((contributor) => ({
          accountUrl: contributor.accountUrl,
          image: `data:image/png;base64,${contributor.image}`,
        }))
      );
    });
  }, []);

  return contributors;
}
