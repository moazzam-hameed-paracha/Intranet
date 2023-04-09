import React from "react";
import { firebase } from "../firebase";

export function useFirebaseSyncWrapper<T>(
  props: Promise<{
    error: firebase.FirebaseError;
    success: boolean;
    data?: T;
  }>,
) {
  const [error, setError] = React.useState<firebase.FirebaseError>(null);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [data, setData] = React.useState<T>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (loading) {
      props.then((result) => {
        setError(result.error);
        setSuccess(result.success);
        setData(result.data);
        setLoading(false);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  return { error, success, data, loading };
}
