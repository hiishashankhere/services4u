export const errorHandler = (err, req, res, _) => {
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }

  if (err.name === "AxiosError") {
    return res
      .status(err.response?.data?.responseCode ?? err.response?.data?.status)
      .json({ message: err.response?.data?.message });
  }

  res
    .status(err.statusCode)
    .json({ err: err.data, message: "Something went wrong!" + err.message });
};
