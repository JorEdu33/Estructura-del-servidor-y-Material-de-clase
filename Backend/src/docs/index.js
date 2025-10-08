// docs/index.js
const path = require('path');
const YAML = require('yamljs');
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API - Sistema de Evaluación Estadística II',
    version: '1.0.0',
    description: `Sistema backend para el ambiente de aprendizaje de Estadística II
    
**Funcionalidades principales:**
- Gestión y evaluación de ejercicios prácticos de estadística
- Calificación automática de respuestas de estudiantes
- Almacenamiento de códigos y soluciones de estudiantes
- Gestión de notas y retroalimentación detallada

**Módulos disponibles:**
- Prácticas 1-5: Ejercicios y evaluaciones por módulo
- Frontend: Endpoints para interfaz web
`
  },
  servers: [
    {
      url: 'http://backend:3000',
      description: 'Servidor de contenedores'
    },
    {
      url: 'https://147.185.221.25:28151',
      description: 'Acceso de servidor por playit.gg'
    }
  ]
};

// Cargar todos los archivos YAML de paths
const studentsDocs = YAML.load(path.join(__dirname, './students.yaml'));
const prac1Docs = YAML.load(path.join(__dirname, './prac1.yaml'));
const prac2Docs = YAML.load(path.join(__dirname, './prac2.yaml'));
const prac3Docs = YAML.load(path.join(__dirname, './prac3.yaml'));
const prac4Docs = YAML.load(path.join(__dirname, './prac4.yaml'));
const prac5Docs = YAML.load(path.join(__dirname, './prac5.yaml'));
const frontDocs = YAML.load(path.join(__dirname, './front.yaml'));

// Cargar todos los componentes individuales
const componentsStudents = YAML.load(path.join(__dirname, './components/components.students.yaml'));
const componentsPrac1 = YAML.load(path.join(__dirname, './components/components.prac1.yaml'));
const componentsPrac2 = YAML.load(path.join(__dirname, './components/components.prac2.yaml'));
const componentsPrac3 = YAML.load(path.join(__dirname, './components/components.prac3.yaml'));
const componentsPrac4 = YAML.load(path.join(__dirname, './components/components.prac4.yaml'));
const componentsPrac5 = YAML.load(path.join(__dirname, './components/components.prac5.yaml'));
const componentsFront = YAML.load(path.join(__dirname, './components/components.front.yaml'));

// Combinar todos los componentes
const allComponents = {
  schemas: {
    ...componentsStudents.schemas,
    ...componentsPrac1.schemas,
    ...componentsPrac2.schemas,
    ...componentsPrac3.schemas,
    ...componentsPrac4.schemas,
    ...componentsPrac5.schemas,
    ...componentsFront.schemas
  },
  responses: {
    ...componentsStudents.responses,
    ...componentsPrac1.responses,
    ...componentsPrac2.responses,
    ...componentsPrac3.responses,
    ...componentsPrac4.responses,
    ...componentsPrac5.responses,
    ...componentsFront.responses
  },
  parameters: {
    ...componentsStudents.parameters,
    ...componentsPrac1.parameters,
    ...componentsPrac2.parameters,
    ...componentsPrac3.parameters,
    ...componentsPrac4.parameters,
    ...componentsPrac5.parameters,
    ...componentsFront.parameters
  },
  requestBodies: {
    ...componentsStudents.requestBodies,
    ...componentsPrac1.requestBodies,
    ...componentsPrac2.requestBodies,
    ...componentsPrac3.requestBodies,
    ...componentsPrac4.requestBodies,
    ...componentsPrac5.requestBodies,
    ...componentsFront.requestBodies
  }
};

// Combinar toda la especificación
const fullSpec = {
  ...swaggerDefinition,
  components: allComponents,
  paths: {
    ...studentsDocs.paths,
    ...prac1Docs.paths,
    ...prac2Docs.paths,
    ...prac3Docs.paths,
    ...prac4Docs.paths,
    ...prac5Docs.paths,
    ...frontDocs.paths,
  }
};

const options = {
  definition: fullSpec,
  apis: [], // No se usan rutas con JSDoc, solo archivos YAML
};

module.exports = swaggerJSDoc(options);