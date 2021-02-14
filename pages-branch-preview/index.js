addEventListener("fetch", (event) => {
  //event.respondWith(handleSchedule(event))
  event.respondWith(handleFetch(event.request));
});

addEventListener("scheduled", (event) => {
  event.waitUntil(handleSchedule(event));
});

async function handleFetch(request) {
  const url = new URL(request.url);
  const branch = url.hostname.replace(ENV_HOSTNAME_SUFFIX, "");
  const kvBranches = await KV_PAGES_BRANCH_PREVIEW.get("branches", "json");

  if (!kvBranches) {
    return new Response("waiting for first CRON Trigger to load branches data");
  }

  if (kvBranches[branch]) {
    return fetch(
      kvBranches[branch].static_url + url.pathname + url.search,
      request
    );
  } else {
    return new Response(`deployment for '${branch}' branch not found`, {
      status: 404,
    });
  }
}

async function handleSchedule(event) {
  const account_id = ENV_ACCOUNT_ID;
  const pages_id = ENV_PAGES_ID;

  const init = {
    method: "GET",
    headers: {
      "X-Auth-Key": SECRET_AUTH_KEY,
      "X-Auth-Email": SECRET_AUTH_EMAIL,
    },
  };

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${account_id}/pages/projects/${pages_id}/deployments?sort_by=created_on&sort_order=desc`,
    init
  );
  const deployments = await res.json();

  let branches = {};

  deployments.result.map((x) => {
    const branch = x.deployment_trigger.branch;
    const branchSlug = branch
      .toLowerCase()
      .replaceAll(/[^a-z0-9]/gi, "-")
      .replaceAll(/(\A-+|-+\z)/gi, "");
    if (
      x.stage &&
      x.stage.name === "deploy" &&
      x.stage.status === "success" &&
      (!branches[branch] || branches[branch].last_modified < x.last_modified)
    ) {
      branches[branchSlug] = {
        last_modified: x.last_modified,
        static_url: x.static_URL,
      };
    }
  });

  console.log(branches);

  await KV_PAGES_BRANCH_PREVIEW.put("branches", JSON.stringify(branches));

  return new Response("OK");
}
