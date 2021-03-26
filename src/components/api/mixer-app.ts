import axios from 'axios';

export const processProject = async (projectId: string) => {
  await axios.get('http://localhost:8070/process-project', {
    params: {
      projectId,
    },
  });
};
