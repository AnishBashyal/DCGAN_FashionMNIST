import React from "react";
import styled from "styled-components";

const Container = styled.div`
  margin-top: 20px;
`;

const Image = styled.img`
  max-width: 300px;
  height: auto;
  border: 1px solid #aaa;
`;

function GeneratedImageDisplay({ imageUrl }) {
  return (
    <Container>
      <h3>Generated Image:</h3>
      {imageUrl ? (
        <Image src={imageUrl} alt="Generated Fashion" />
      ) : (
        <p>No image generated yet.</p>
      )}
    </Container>
  );
}

export default GeneratedImageDisplay;
