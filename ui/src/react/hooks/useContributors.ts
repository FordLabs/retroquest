import { Contributor } from '../types/Contributor';
import {useEffect, useState} from "react";

export default function (): Contributor[] {
  const [contributors, setContributors] = useState<Contributor[]>([]);

  useEffect(() => {
    fetch('/api/contributors').then((result) =>
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
