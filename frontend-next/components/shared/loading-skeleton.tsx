import { Box, Skeleton } from "@mui/material";

export const HomeCTALoading = () => (
  <Box sx={{ width: "20rem", textAlign: "center", mt: 8 }}>
    <Skeleton variant="rectangular" width="100%" height={56} />
    <Skeleton
      variant="rectangular"
      width="60%"
      height={40}
      sx={{ mt: 2, mx: "auto" }}
    />
    <Box
      sx={{ display: "flex", justifyContent: "center", gap: "0.5rem", mt: 2 }}
    >
      <Skeleton variant="circular" width={32} height={32} />
      <Skeleton variant="circular" width={32} height={32} />
    </Box>
  </Box>
);
export const LoadingPage = () => (
  <Box
    sx={{
      width: "100%",
      minHeight: "60vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 3,
      px: 2,
      py: 4,
    }}
  >
    <Skeleton variant="rectangular" width="40%" height={48} />
    <Skeleton variant="rectangular" width="60%" height={28} />
    <Skeleton variant="rectangular" width="80%" height={28} />
    <Skeleton variant="rectangular" width="90%" height={28} />

    <Skeleton variant="rectangular" width="70%" height={200} />

    <Skeleton variant="rectangular" width="50%" height={36} />
    <Skeleton variant="rectangular" width="70%" height={36} />
    <Skeleton variant="rectangular" width="30%" height={36} />
  </Box>
);
