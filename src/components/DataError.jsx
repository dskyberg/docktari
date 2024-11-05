import { useAsyncError } from "react-router-dom";

import { Alert } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

export default function DataError(props) {
  const error = useAsyncError();
  const icon = <IconInfoCircle />;

  return (
    <Alert variant="outline" color="red" title="Data Error" icon={icon} {...props}>
      {error.message}
    </Alert>
  );
}
