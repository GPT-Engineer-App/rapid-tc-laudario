import React, { useState } from "react";
import { Box, Heading, Text, Textarea, Button, Select, Checkbox, Stack, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from "@chakra-ui/react";

const Index = () => {
  const [exam, setExam] = useState("TC Abdome");
  const [report, setReport] = useState("");
  const [findings, setFindings] = useState({});

  const exams = ["TC Abdome", "TC Pelve", "TC Crânio sem contraste", "TC Crânio com contraste"];

  const [organFindings, setOrganFindings] = useState({
    Fígado: {
      Normal: "Fígado de dimensões normais, contornos regulares e textura homogênea do parênquima, sem evidências de lesões focais.",
      Esteatose: "Fígado de dimensões aumentadas, com atenuação difusamente reduzida do parênquima, sugestivo de esteatose hepática.",
      Nódulos: "Presença de nódulos hepáticos, o maior deles medindo X cm, com realce heterogêneo pelo meio de contraste, a esclarecer etiologia.",
    },
    Vesícula: {
      Normal: "Vesícula biliar normodistendida, de paredes finas e conteúdo homogêneo.",
      Litíase: "Vesícula biliar normodistendida, com presença de cálculos no seu interior, o maior medindo X cm.",
      "Colecistite xantogranulomatosa": "Vesícula biliar hiperdistendida, com paredes espessadas e contendo cálculos calcificados no seu interior, medindo até 5,0 cm. Algumas áreas da sua parede apresentam-se descontínuas e em contato com formações hipoatenuantes no parênquima hepático adjacente nos segmentos IV e V, aspecto que pode representar pequenos abscessos resultantes de perfuração vesicular bloqueada.",
    },
    Pâncreas: {
      Normal: "Pâncreas de dimensões e contornos habituais, sem alterações da sua densidade.",
      Atrofia: "Pâncreas de dimensões reduzidas e contornos lobulados, compatível com atrofia pancreática.",
      Pseudocisto: "Formação cística uniloculada na topografia da cauda pancreática, com paredes finas e conteúdo homogêneo, medindo X cm, compatível com pseudocisto pancreático.",
    },
    Rins: {
      Normais: "Rins tópicos, de dimensões, contornos e densidade habituais, sem evidências de lesões focais ou dilatação pielocalicinal.",
      "Cisto simples": "Presença de cisto renal simples à direita/esquerda, de paredes finas e conteúdo homogêneo, medindo X cm.",
      Litíase: "Presença de cálculo renal à direita/esquerda, localizado no grupo calicial superior/médio/inferior, medindo X cm.",
    },
    "Alças intestinais": {
      Normais: "Alças intestinais de calibre e paredes habituais, sem evidências de espessamentos parietais ou distensões segmentares.",
      Distensão: "Distensão difusa das alças intestinais, algumas delas apresentando níveis hidroaéreos, sugestivo de íleo paralítico/obstrutivo.",
      "Espessamento parietal": "Espessamento parietal segmentar de alça intestinal no quadrante inferior direito/esquerdo, associado a densificação dos planos adiposos mesentéricos adjacentes, a esclarecer etiologia.",
    },
    Crânio: {
      Normal: "Parênquima encefálico de morfologia e densidade habituais, com adequada diferenciação entre substâncias branca e cinzenta. Sistema ventricular de dimensões e topografia normais. Estruturas da fossa posterior sem alterações. Calcificações fisiológicas nos plexos coróides e glândula pineal.",
      "Atrofia cortical": "Redução volumétrica difusa do parênquima encefálico, com alargamento compensatório dos sulcos corticais e fissuras encefálicas, compatível com atrofia cortical.",
      "Lesão expansiva": "Presença de lesão expansiva no lobo frontal/parietal/temporal/occipital direito/esquerdo, com efeito de massa sobre as estruturas adjacentes, realce heterogêneo pelo meio de contraste e área de edema perilesional, medindo X cm.",
      Hemorragia: "Hiperdensidade espontânea no interior do parênquima encefálico na topografia dos núcleos da base/tálamos/cerebelo à direita/esquerda, compatível com hemorragia intraparenquimatosa aguda/subaguda.",
    },
  });

  const handleFindingChange = (organ, finding) => {
    setFindings((prev) => {
      const newFindings = { ...prev };
      newFindings[organ] = newFindings[organ] || {};
      newFindings[organ][finding] = !newFindings[organ][finding];
      return newFindings;
    });
  };

  const addFindingsToReport = () => {
    let text = "";
    for (const organ in findings) {
      const selectedFindings = Object.entries(findings[organ])
        .filter(([_, selected]) => selected)
        .map(([finding]) => organFindings[organ][finding])
        .join(" ");

      if (selectedFindings) {
        text += `${organ}: ${selectedFindings}\n\n`;
      }
    }
    setReport(text.trim());
  };

  const handleExportConfig = () => {
    const config = { exam, organFindings, findings };
    const json = JSON.stringify(config, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "config.json";
    link.click();
  };

  const handleImportConfig = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const config = JSON.parse(e.target.result);
      setExam(config.exam);
      setOrganFindings(config.organFindings);
      setFindings(config.findings);
    };
    reader.readAsText(file);
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
      <Button as="label" htmlFor="import-config">
        Importar Config
        <input id="import-config" type="file" accept=".json" onChange={handleImportConfig} style={{ display: "none" }} />
      </Button>
    </Box>
  );
};

export default Index;
