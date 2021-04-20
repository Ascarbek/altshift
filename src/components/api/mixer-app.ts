import axios from 'axios';
import { backend } from '../../config.json';

export const processProject = async (projectId: string, projectName: string) => {
  await axios.get(`${backend}/process-project`, {
    params: {
      projectId,
      projectName,
    },
  });
};
