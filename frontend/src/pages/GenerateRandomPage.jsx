import React, { useState, useCallback } from "react";
import styled from "styled-components";

const Container = styled.div`
  text-align: center;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center; /* Center items horizontally */
`;

const GeneratedImage = styled.img`
  max-width: 300px;
  height: auto;
  border: 1px solid #aaa;
  margin-top: 20px;
`;

const GenerateButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
`;

function GenerateRandomPage() {
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);

  const fetchNewImage = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/generate_single");

      if (!response.ok) {
        console.error(
          "Failed to fetch image data:",
          response.status,
          response.statusText
        );
        return;
      }

      const data = await response.json();
      if (data && data.image) {
        setGeneratedImageUrl(`data:image/png;base64,${data.image}`);
        if (data.latent_vector) {
          console.log(
            "Latent Vector (Body - GenerateRandom):",
            data.latent_vector
          );
        }
      } else {
        console.error("Image data not found in response body");
      }
    } catch (error) {
      console.error("Error generating image:", error);
    }
  }, []);

  return (
    <Container>
      <h2>Generate a Unique Fashion Item</h2>
      <GenerateButton onClick={fetchNewImage}>Generate</GenerateButton>
      {generatedImageUrl && (
        <GeneratedImage src={generatedImageUrl} alt="Generated Fashion" />
      )}
    </Container>
  );
}

export default GenerateRandomPage;
