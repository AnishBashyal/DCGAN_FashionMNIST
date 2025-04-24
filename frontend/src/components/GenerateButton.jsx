import React from "react";
import styled from "styled-components";

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
`;

function GenerateButton({ onClick }) {
  return <Button onClick={onClick}>Generate Random Item</Button>;
}

export default GenerateButton;
