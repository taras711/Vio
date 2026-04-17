import React from "react";
import { Box, Typography, Button } from "@mui/material";

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Something went wrong
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            Error: {this.state.error?.message}
          </Typography>

          <Button variant="contained" onClick={this.handleReset}>
            Try Again
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
