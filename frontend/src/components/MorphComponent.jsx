import React, { useState, useCallback, useEffect, useRef } from "react";
import styled from "styled-components";

const GenerationSection = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const ImageContainer = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
`;

const PlaceholderImage = styled.div`
  width: 80%;
  height: 80%;
  background-color: #ddd;
`;

const GeneratedImage = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

const GenerateButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
`;

const MorphControlPanel = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 20px;
  align-items: center;
`;

const MorphButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  disabled: ${(props) => !props.canMorph};
`;

const FrameInput = styled.input`
  padding: 8px;
  font-size: 16px;
  width: 80px;
`;

const MorphAnimationContainer = styled.div`
  margin-top: 30px;
  border: 1px solid #aaa;
  padding: 20px;
  min-height: 100px;
  display: flex;
  gap: 10px;
  overflow-x: auto;
`;

const MorphFrame = styled.img`
  max-height: 80px;
`;

const PlayControlContainer = styled.div`
  margin-top: 20px;
  border: 1px solid #bbb;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Slider = styled.input`
  width: 100%;
  margin: 10px 0;
`;

const CarouselView = styled.img`
  max-width: 300px;
  max-height: 300px;
  border: 1px solid #888;
  margin-bottom: 10px;
`;

const PlayButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
`;

function MorphComponent() {
  const [image1Url, setImage1Url] = useState(null);
  const [image1Latent, setImage1Latent] = useState(null);
  const [image2Url, setImage2Url] = useState(null);
  const [image2Latent, setImage2Latent] = useState(null);
  const [morphingImages, setMorphingImages] = useState([]);
  const [sliderValue, setSliderValue] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const animationInterval = useRef(null);
  const canMorph = image1Latent && image2Latent;
  const [numFramesInput, setNumFramesInput] = useState(50); // Default value

  const generateImage = useCallback(async (imageSetter, latentSetter) => {
    try {
      const response = await fetch("http://localhost:5000/generate_single");
      if (!response.ok)
        console.error("Failed to fetch image:", response.status);
      const data = await response.json();
      if (data?.image && data?.latent_vector) {
        imageSetter(`data:image/png;base64,${data.image}`);
        latentSetter(data.latent_vector);
      }
    } catch (error) {
      console.error("Error generating image:", error);
    }
  }, []);

  const handleMorph = useCallback(async () => {
    if (image1Latent && image2Latent) {
      try {
        const response = await fetch("http://localhost:5000/morph", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            start_vector: image1Latent,
            end_vector: image2Latent,
            steps: parseInt(numFramesInput, 10) - 1,
          }),
        });
        if (!response.ok) console.error("Morphing failed:", response.status);
        const data = await response.json();
        if (data?.images) {
          const imageUrls = data.images.map(
            (base64Image) => `data:image/png;base64,${base64Image}`
          );
          setMorphingImages(imageUrls);
          setSliderValue(0);
          setIsPlaying(false);
        }
      } catch (error) {
        console.error("Error during morphing:", error);
      }
    } else {
      alert("Please generate two images first.");
    }
  }, [image1Latent, image2Latent, numFramesInput]);

  const handleSliderChange = useCallback((event) => {
    setSliderValue(parseInt(event.target.value, 10));
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  }, []);

  const handleNumFramesChange = useCallback((event) => {
    setNumFramesInput(event.target.value);
  }, []);

  useEffect(() => {
    if (isPlaying && morphingImages.length > 0) {
      animationInterval.current = setInterval(() => {
        setSliderValue((prevValue) => (prevValue + 1) % morphingImages.length);
      }, 200);
    } else if (!isPlaying) {
      clearInterval(animationInterval.current);
    }
    return () => clearInterval(animationInterval.current);
  }, [isPlaying, morphingImages]);

  const currentMorphImage = morphingImages[sliderValue];

  return (
    <div>
      <GenerationSection>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <ImageContainer>
            {!image1Url && <PlaceholderImage />}
            {image1Url && <GeneratedImage src={image1Url} alt="Generated 1" />}
          </ImageContainer>
          <GenerateButton
            onClick={() => generateImage(setImage1Url, setImage1Latent)}
          >
            Generate First
          </GenerateButton>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <ImageContainer>
            {!image2Url && <PlaceholderImage />}
            {image2Url && <GeneratedImage src={image2Url} alt="Generated 2" />}
          </ImageContainer>
          <GenerateButton
            onClick={() => generateImage(setImage2Url, setImage2Latent)}
          >
            Generate Second
          </GenerateButton>
        </div>
      </GenerationSection>

      <MorphControlPanel>
        <MorphButton onClick={handleMorph} disabled={!canMorph}>
          Morph Them!
        </MorphButton>
        <div>
          <label htmlFor="numFrames">Number of Frames:</label>
          <FrameInput
            type="number"
            id="numFrames"
            value={numFramesInput}
            onChange={handleNumFramesChange}
            min="2"
          />
        </div>
      </MorphControlPanel>

      <MorphAnimationContainer>
        <h3>Morphing Sequence</h3>
        {morphingImages.length > 0 ? (
          morphingImages.map((imageUrl, index) => (
            <MorphFrame
              key={index}
              src={imageUrl}
              alt={`Morph Frame ${index}`}
            />
          ))
        ) : (
          <div>Awaiting Morph</div>
        )}
      </MorphAnimationContainer>

      {morphingImages.length > 0 && (
        <PlayControlContainer>
          <h3>Control Playback</h3>
          <CarouselView
            src={currentMorphImage}
            alt={`Morph Frame ${sliderValue}`}
          />
          <Slider
            type="range"
            min="0"
            max={morphingImages.length - 1}
            value={sliderValue}
            onChange={handleSliderChange}
          />
          <PlayButton onClick={togglePlay}>
            {isPlaying ? "Pause" : "Play"}
          </PlayButton>
        </PlayControlContainer>
      )}
    </div>
  );
}

export default MorphComponent;
