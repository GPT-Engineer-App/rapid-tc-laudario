import React, { useState } from "react";
import { Box, Heading, Text, Textarea, Button, Select, Checkbox, Stack, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from "@chakra-ui/react";

const Index = () => {
  const [exam, setExam] = useState("TC Abdome");
  const [report, setReport] = useState("");
  const [findings, setFindings] = useState({});

  const exams = ["TC Abdome", "TC Pelve", "TC Crânio sem contraste", "TC Crânio com contraste"];

  const organFindings = {
    Fígado: ["Normal", "Esteatose", "Nódulos"],
    Pâncreas: ["Normal", "Atrofia", "Pseudocisto"],
    Rins: ["Normais", "Cisto simples", "Litíase"],
    "Alças intestinais": ["Normais", "Distensão", "Espessamento parietal"],
    Crânio: ["Normal", "Atrofia cortical", "Lesão expansiva", "Hemorragia"],
  };

  const handleFindingChange = (organ, finding) => {
    setFindings((prev) => ({
      ...prev,
      [organ]: {
        ...prev[organ],
        [finding]: !prev[organ]?.[finding],
      },
    }));
  };

  const addFindingsToReport = () => {
    let text = "";
    for (const organ in findings) {
      const selectedFindings = Object.entries(findings[organ])
        .filter(([_, selected]) => selected)
        .map(([finding]) => finding)
        .join(", ");

      if (selectedFindings) {
        text += `${organ}: ${selectedFindings}. `;
      } else {
        text += `${organ}: sem alterações. `;
      }
    }
    setReport(text);
  };

  const handleExportConfig = () => {
    const config = { exam, findings };
    const json = JSON.stringify(config);
    // Simular download do arquivo de configuração
    console.log(json);
  };

  const handleImportConfig = () => {
    // Simular upload do arquivo de configuração
    const json = prompt("Cole o JSON de configuração:");
    const config = JSON.parse(json);
    setExam(config.exam);
    setFindings(config.findings);
  };

  return (
    <Box p={8}>
      <Heading as="h1" mb={8}>
        Laudário de TC
      </Heading>

      <Select value={exam} onChange={(e) => setExam(e.target.value)} mb={4}>
        {exams.map((exam) => (
          <option key={exam} value={exam}>
            {exam}
          </option>
        ))}
      </Select>

      <Accordion allowMultiple>
        {Object.entries(organFindings).map(([organ, findings]) => (
          <AccordionItem key={organ}>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                {organ}
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Stack>
                {findings.map((finding) => (
                  <Checkbox key={finding} isChecked={Boolean(organFindings[organ]?.[finding])} onChange={() => handleFindingChange(organ, finding)}>
                    {finding}
                  </Checkbox>
                ))}
              </Stack>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      <Button onClick={addFindingsToReport} colorScheme="blue" my={4}>
        Adicionar achados
      </Button>

      <Textarea value={report} readOnly height="200px" mb={4} />

      <Button onClick={() => setReport("")} mr={4}>
        Limpar
      </Button>

      <Button onClick={handleExportConfig} mr={4}>
        Exportar Config
      </Button>
      <Button onClick={handleImportConfig}>Importar Config</Button>
    </Box>
  );
};

export default Index;
