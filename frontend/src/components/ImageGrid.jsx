import React from "react";
import styled from "styled-components";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(100px, 1fr)
  ); /* Adjust size as needed */
  gap: 10px;
  margin-top: 20px;
`;

const GridImage = styled.img`
  width: 100%;
  height: auto;
  border: 1px solid #ccc;
`;

function ImageGrid({ imageUrls }) {
  return (
    <GridContainer>
      {imageUrls.map((imageUrl, index) => (
        <GridImage key={index} src={imageUrl} alt={`Generated ${index}`} />
      ))}
    </GridContainer>
  );
}

export default ImageGrid;
