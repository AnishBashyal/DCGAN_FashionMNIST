import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import EpochSlider from "../components/EpochSlider";
import EpochComparison from "../components/EpochComparison";
import LossCurve from "../components/LossCurve";

const Container = styled.div`
  text-align: center;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ImageAndCurveContainer = styled.div`
  display: flex;
  gap: 40px;
  align-items: center;
  margin-bottom: 20px;
`;

const ImageDisplay = styled.img`
  max-width: 450px;
  max-height: 450px;
  width: 450px;
  height: 450px;
  border: 1px solid #aaa;
  margin-top: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  object-fit: contain;
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 20px;
  gap: 20px;
`;

const EpochNumber = styled.h2`
  margin-top: 0;
`;

const PlayPauseButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
`;

const ComparisonToggle = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
`;

function EpochHistoryPage() {
  const totalEpochs = 100;
  const [selectedEpoch, setSelectedEpoch] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = React.useRef(null);
  const [showComparison, setShowComparison] = useState(false);
  const [lossData, setLossData] = useState([]);

  const epochHistory = Array.from({ length: totalEpochs }, (_, index) => ({
    id: index + 1,
    generatedImage: `/intermediate_images/epoch_${String(index + 1).padStart(
      3,
      "0"
    )}.png`,
    metrics: {
      loss: Math.random().toFixed(4),
      accuracy: (Math.random() * 100).toFixed(2),
    },
  }));

  const handleEpochChange = useCallback((epoch) => {
    setSelectedEpoch(epoch);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  }, []);

  const toggleComparisonView = useCallback(() => {
    setShowComparison((prevShowComparison) => !prevShowComparison);
  }, []);

  useEffect(() => {
    fetch("/dcgan_losses.csv")
      .then((response) => response.text())
      .then((csvText) => {
        const lines = csvText.split("\n").slice(1); // Split by lines and skip header
        const parsedData = lines
          .map((line) => {
            const [d_loss, g_loss] = line.split(",");
            return { d_loss: parseFloat(d_loss), g_loss: parseFloat(g_loss) };
          })
          .filter((item) => !isNaN(item.d_loss) && !isNaN(item.g_loss)); // Filter out invalid lines
        setLossData(parsedData);
      })
      .catch((error) => console.error("Error fetching or parsing CSV:", error));
  }, []);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setSelectedEpoch((prevEpoch) => {
          const nextEpoch = prevEpoch < totalEpochs ? prevEpoch + 1 : 1;
          return nextEpoch;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, totalEpochs]);

  const currentEpochImageUrl = `/intermediate_images/epoch_${String(
    selectedEpoch
  ).padStart(3, "0")}.png`;

  return (
    <Container>
      <h2>Epoch History Explorer</h2>
      <EpochSlider
        totalEpochs={totalEpochs}
        selectedEpoch={selectedEpoch}
        onEpochChange={handleEpochChange}
      />

      <ImageAndCurveContainer>
        {currentEpochImageUrl && (
          <ImageDisplay
            src={currentEpochImageUrl}
            alt={`Epoch ${selectedEpoch}`}
          />
        )}
        {lossData.length > 0 && (
          <div style={{ width: "700px" }}>
            {" "}
            {/* Increased the width here */}
            <LossCurve lossData={lossData} currentEpoch={selectedEpoch} />
          </div>
        )}
      </ImageAndCurveContainer>

      <ControlsContainer>
        <EpochNumber>Epoch: {selectedEpoch}</EpochNumber>
      </ControlsContainer>
      <PlayPauseButton onClick={togglePlay}>
        {isPlaying ? "Pause" : "Play"}
      </PlayPauseButton>

      <ComparisonToggle onClick={toggleComparisonView}>
        {showComparison ? "Hide Comparison" : "Compare Epochs"}
      </ComparisonToggle>

      {showComparison && <EpochComparison epochHistory={epochHistory} />}
    </Container>
  );
}

export default EpochHistoryPage;
