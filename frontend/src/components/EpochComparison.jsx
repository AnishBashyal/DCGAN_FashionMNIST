import React, { useState } from "react";
import styled from "styled-components";

const ComparisonContainer = styled.div`
  display: flex;
  gap: 20px;
`;

const EpochPanel = styled.div`
  flex: 1;
  border: 1px solid #ccc;
  padding: 15px;
`;

const EpochSelector = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
`;

const ComparisonView = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ComparisonImage = styled.img`
  max-width: 100%;
  max-height: 300px;
  border: 1px solid #888;
  margin-bottom: 10px;
`;

const MetricList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const MetricItem = styled.li`
  margin-bottom: 5px;
`;

function EpochComparison({ epochHistory }) {
  const [selectedEpochId1, setSelectedEpochId1] = useState("");
  const [selectedEpochId2, setSelectedEpochId2] = useState("");

  const epoch1 = epochHistory.find(
    (epoch) => String(epoch.id) === selectedEpochId1
  );
  const epoch2 = epochHistory.find(
    (epoch) => String(epoch.id) === selectedEpochId2
  );

  const handleEpoch1Change = (event) => {
    const selectedId = event.target.value;
    setSelectedEpochId1(selectedId);
    console.log("Selected Epoch 1 ID:", selectedId, typeof selectedId);
  };

  const handleEpoch2Change = (event) => {
    const selectedId = event.target.value;
    setSelectedEpochId2(selectedId);
    console.log("Selected Epoch 2 ID:", selectedId, typeof selectedId);
  };

  console.log("Epoch History in Comparison:", epochHistory);
  console.log(
    "First Epoch ID in History:",
    epochHistory[0]?.id,
    typeof epochHistory[0]?.id
  );
  console.log("Epoch 1 Data:", epoch1);
  console.log("Epoch 2 Data:", epoch2);

  return (
    <div>
      <h2>Compare Epochs</h2>
      <ComparisonContainer>
        <EpochPanel>
          <h3>Select Epoch 1</h3>
          <EpochSelector value={selectedEpochId1} onChange={handleEpoch1Change}>
            <option value="">-- Select an Epoch --</option>
            {epochHistory.map((epoch) => (
              <option key={epoch.id} value={epoch.id}>
                {epoch.id}
              </option>
            ))}
          </EpochSelector>
          {epoch1 && (
            <ComparisonView>
              <h4>Epoch {epoch1.id}</h4>
              {epoch1.generatedImage && (
                <ComparisonImage
                  src={epoch1.generatedImage}
                  alt={`Epoch ${epoch1.id}`}
                />
              )}
              {epoch1.metrics && Object.keys(epoch1.metrics).length > 0 && (
                <div>
                  <strong>Metrics:</strong>
                  <MetricList>
                    {Object.entries(epoch1.metrics).map(([key, value]) => (
                      <MetricItem key={key}>
                        {key}: {value}
                      </MetricItem>
                    ))}
                  </MetricList>
                </div>
              )}
              {!epoch1.generatedImage && !epoch1.metrics && (
                <p>No data to display for this epoch.</p>
              )}
            </ComparisonView>
          )}
        </EpochPanel>

        <EpochPanel>
          <h3>Select Epoch 2</h3>
          <EpochSelector value={selectedEpochId2} onChange={handleEpoch2Change}>
            <option value="">-- Select an Epoch --</option>
            {epochHistory.map((epoch) => (
              <option key={epoch.id} value={epoch.id}>
                {epoch.id}
              </option>
            ))}
          </EpochSelector>
          {epoch2 && (
            <ComparisonView>
              <h4>Epoch {epoch2.id}</h4>
              {epoch2.generatedImage && (
                <ComparisonImage
                  src={epoch2.generatedImage}
                  alt={`Epoch ${epoch2.id}`}
                />
              )}
              {epoch2.metrics && Object.keys(epoch2.metrics).length > 0 && (
                <div>
                  <strong>Metrics:</strong>
                  <MetricList>
                    {Object.entries(epoch2.metrics).map(([key, value]) => (
                      <MetricItem key={key}>
                        {key}: {value}
                      </MetricItem>
                    ))}
                  </MetricList>
                </div>
              )}
              {!epoch2.generatedImage && !epoch2.metrics && (
                <p>No data to display for this epoch.</p>
              )}
            </ComparisonView>
          )}
        </EpochPanel>
      </ComparisonContainer>
    </div>
  );
}

export default EpochComparison;
