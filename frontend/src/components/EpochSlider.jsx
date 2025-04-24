import React from "react";
import styled from "styled-components";

const SliderContainer = styled.div`
  margin-bottom: 20px;
  width: 80%; /* Adjust width as needed */
`;

const Slider = styled.input`
  width: 100%;
`;

const EpochLabel = styled.p`
  margin-top: 5px;
`;

function EpochSlider({ totalEpochs, selectedEpoch, onEpochChange }) {
  return (
    <SliderContainer>
      <Slider
        type="range"
        min="1"
        max={totalEpochs}
        value={selectedEpoch}
        onChange={(e) => onEpochChange(parseInt(e.target.value))}
      />
      <EpochLabel>Epoch: {selectedEpoch}</EpochLabel>
    </SliderContainer>
  );
}

export default EpochSlider;
