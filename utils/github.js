import axios from 'axios';
import { getNowDayjs } from './_dayjs';
import { encodeBase64 } from './utils';
import blogConfig from '../blog.config';

axios.interceptors.request.use((value) => {
  console.log(value.data.query);
  return value;
});

export async function post(data) {
  return await axios.post(
    'https://api.github.com/graphql',
    { query: data },
    {
      headers: {
        Authorization: 'token ' + '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',
      },
    }
  );
}

async function getExpectedHeadOid() {
  const result = await post(`query {
    repository(name: "${blogConfig.githubRepo}", owner: "${blogConfig.githubName}") {
      defaultBranchRef {
        target {
          ... on Commit {
            history(first: 1) {
              nodes {
                oid
              }
            }
          }
        }
      }
    }
  }`);
  const err = result.data.errors;
  if (err) {
    console.log(err);
  } else {
    return result.data.data.repository.defaultBranchRef.target.history.nodes[0]
      .oid;
  }
}

/** @description 提交 Github commit */
export async function createCommit(
  commitMessage = '',
  additions = [],
  deletions = []
) {
  console.log('++++++++++++++++++++++');
  let add = '';
  let del = '';
  if (additions.length) {
    add = 'additions: [';
    additions.forEach((item) => {
      add += `{path: "posts/${getNowDayjs().year()}/${getNowDayjs().month()}/${
        item.name
      }.md",contents: "${encodeBase64(item.content)}"},`;
    });
    add += '],';
  }
  if (deletions.length) {
    del = 'deletions: [';
    deletions.forEach((item) => {
      del += `{path: "${item.path}"},`;
    });
    del += ']';
  }
  try {
    const expectedHeadOid = await getExpectedHeadOid();
    const result = await post(`mutation {
      createCommitOnBranch(
        input: {
          branch: {
            branchName: "${blogConfig.githubBranch}",
            repositoryNameWithOwner: "${blogConfig.githubName}/${
      blogConfig.githubRepo
    }"
          },
          message: {
            headline: "[🤖${getNowDayjs().format(
              'YYYY-MM-DD HH:mm:ss'
            )}]${commitMessage}"
          },
          expectedHeadOid: "${expectedHeadOid}",
          fileChanges: {
            ${add}
            ${del}
          }
        }
      ) {
        clientMutationId
      }
    }`);
    const err = result.data.errors;
    if (err) {
      console.log(err);
      return false;
    }
    return true;
  } catch (err) {
    console.log(err);
  }
}
