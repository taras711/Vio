import { useState } from "react";
import { Box } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import type { FragmentMap, FragmentName, FragmentState } from "../../../../shared/types";

export function InfoPanel({
  initialFragment,
  fragments
}: {
  initialFragment: FragmentState;
  fragments: FragmentMap;
}) {
  const [fragment, setFragment] = useState<FragmentState>(initialFragment);

  const FragmentComponent = fragments[fragment.name];

  function openFragment(name: FragmentName, props?: any) {
    setFragment({ name, props });
  }

  return (
    <Box sx={{ height: "100%", position: "relative", overflow: "hidden" }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={fragment.name}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            overflowX: "hidden"
          }}
        >
          <FragmentComponent
            {...(fragment.props ?? {})}
            openFragment={openFragment}
          />
        </motion.div>
      </AnimatePresence>
    </Box>
  );
}


