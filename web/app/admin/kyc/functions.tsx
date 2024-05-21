

export async function retrieveAllApplicants() {
    console.log('retrieving all applicants')
  const response = await fetch('/api/onfido/retrieve/all_applicants', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data;
}

export async function retrieveApplicantById(applicantId: string) {
  const response = await fetch('/api/onfido/retrieve/applicant', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      applicant_id: applicantId,
    }),
  });
  const data = await response.json();
  return data;
}

export async function retrieveWorkflowRun(workflowId: string) {
  const response = await fetch('/api/onfido/retrieve/workflow_run', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      workflow_run_id: workflowId,
    }),
  });
  const data = await response.json();
  return data;
}

export async function retrieveAllWorkflowRuns() {
  const response = await fetch('/api/onfido/retrieve/all_workflow_runs', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data;
}