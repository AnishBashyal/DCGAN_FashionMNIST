import React from "react";
import styled from "styled-components";
import MorphComponent from "../components/MorphComponent";

const Container = styled.div`
  text-align: center;
  padding: 20px;
`;

function MorphPage() {
  return (
    <Container>
      <h2>Fashion Fusion Lab</h2>
      <MorphComponent />
    </Container>
  );
}

export default MorphPage;
