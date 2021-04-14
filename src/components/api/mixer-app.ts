import axios from 'axios';

export const processProject = async (projectId: string) => {
  await axios.get('https://mixer1.altshift.cc/process-project', {
    params: {
      projectId,
    },
  });
};
