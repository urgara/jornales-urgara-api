import { v6 as uuidv6 } from 'uuid';

const surveyors = `
INSERT INTO public."Surveyor" (id, originalId, name) VALUES ('',1,'ECOTEC SURVEYING');
INSERT INTO public."Surveyor" (id, originalId, name) VALUES ('',2,'EUROAMERICA');
INSERT INTO public."Surveyor" (id, originalId, name) VALUES ('',3,'CCIS SOUTH AMERICA');
INSERT INTO public."Surveyor" (id, originalId, name) VALUES ('',4,'CIS');
INSERT INTO public."Surveyor" (id, originalId, name) VALUES ('',5,'FIDES CONTROL');
INSERT INTO public."Surveyor" (id, originalId, name) VALUES ('',6,'BALTIC CONTROL');
INSERT INTO public."Surveyor" (id, originalId, name) VALUES ('',7,'RRMG SA');
INSERT INTO public."Surveyor" (id, originalId, name) VALUES ('',8,'ITS');
INSERT INTO public."Surveyor" (id, originalId, name) VALUES ('',9,'COTECNA');
INSERT INTO public."Surveyor" (id, originalId, name) VALUES ('',10,'SGS');
INSERT INTO public."Surveyor" (id, originalId, name) VALUES ('',11,'UNION');
INSERT INTO public."Surveyor" (id, originalId, name) VALUES ('',12,'TRUST CONTROL');
INSERT INTO public."Surveyor" (id, originalId, name) VALUES ('',13,'CONTROL SERVICE');
INSERT INTO public."Surveyor" (id, originalId, name) VALUES ('',14,'OPEAGR0');
INSERT INTO public."Surveyor" (id, originalId, name) VALUES ('',15,'ISB CONTROL');
INSERT INTO public."Surveyor" (id, originalId, name) VALUES ('',16,'INTERTEK');
INSERT INTO public."Surveyor" (id, originalId, name) VALUES ('',17,'OTI');
INSERT INTO public."Surveyor" (id, originalId, name) VALUES ('',18,'COTECNA/EUROAMERICA');
INSERT INTO public."Surveyor" (id, originalId, name) VALUES ('',19,'ALEX STEWART');
INSERT INTO public."Surveyor" (id, originalId, name) VALUES ('',20,'HL CONTROL SERV');
INSERT INTO public."Surveyor" (id, originalId, name) VALUES ('',21,'BUREAU VERITAS');
INSERT INTO public."Surveyor" (id, originalId, name) VALUES ('',22,'SYCAP');
INSERT INTO public."Surveyor" (id, originalId, name) VALUES ('',23,'SAPEI CONTROL');
INSERT INTO public."Surveyor" (id, originalId, name) VALUES ('',24,'TCIS');
INSERT INTO public."Surveyor" (id, originalId, name) VALUES ('',25,'LEON INSPEC');
INSERT INTO public."Surveyor" (id, originalId, name) VALUES ('',26,'LEON INSPECTION');
`;

// Parse the SQL and generate new UUIDs
const lines = surveyors.trim().split('\n');
const results = lines.map(line => {
  if (!line.trim()) return '';

  // Generate a new UUID v6
  const uuid = uuidv6();

  // Replace empty string for id with the generated UUID
  return line.replace(/\(''/, `('${uuid}'`);
});

// Output the result
console.log(results.join('\n'));
