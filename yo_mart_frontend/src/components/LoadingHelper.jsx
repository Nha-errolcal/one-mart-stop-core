import { Flex, Spin } from "antd";
import React from "react";

const LoadingHelper = ({ loading = false }) => {
  if (!loading) return null;

  return (
    <Flex
      justify="center"
      align="center"
      style={{ width: "100%", padding: "24px" }}
    >
      <Spin size="default" />
    </Flex>
  );
};

export default LoadingHelper;
