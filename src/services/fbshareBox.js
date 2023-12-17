const axios = require('axios');

async function sharePost(accessToken, shareUrl, shareAmount, timeInterval, deleteAfter) {
  let sharedCount = 0;

  return new Promise((resolve, reject) => {
    const timer = setInterval(async () => {
      try {
        const response = await axios.post(
          `https://graph.facebook.com/me/feed?access_token=${accessToken}&fields=id&limit=1&published=0`,
          {
            link: shareUrl,
            privacy: { value: 'SELF' },
            no_story: true,
          },
          {
            muteHttpExceptions: true,
            headers: {
              authority: 'graph.facebook.com',
              'cache-control': 'max-age=0',
              'sec-ch-ua-mobile': '?0',
              'user-agent':
                'Mozilla/5.0 (Linux; Android 11; TECNO LE6h) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.6099.26 WebviumDev/2.9-dev Mobile Safari/537.36',
            },
            method: 'post',
          }
        );

        sharedCount++;
        const postId = response?.data?.id;

        console.log(`Shared Count: ${sharedCount}`);
        console.log(`Post ID: ${postId || 'Unknown'}`);
        console.log(`Post Link: ${shareUrl}`);

        if (sharedCount === shareAmount) {
          clearInterval(timer);
          console.log('Done sharing post!');

          if (postId) {
            setTimeout(() => {
              deletePost(postId, accessToken);
            }, deleteAfter * 1000);
          }

            resolve({ message: `Successfully Boosted Post Link: ${shareUrl} with Total Amount of ${shareAmount} Shares!\n\n𝗗𝗲𝘃: https://www.facebook.com/100081201591674\n𝗕𝘂𝘆 𝗠𝗲 𝗔 𝗖𝗼𝗳𝗳𝗲𝗲!☕\nhttps://reikodev.gumroad.com/l/codebox4chan` });
          }
      } catch (error) {
        console.error(`Failed to Boost Shares Post Link: ${shareUrl}\n\nThe Token is no longer valid or temporary restricted! please replace with new token!`);
        clearInterval(timer);
        reject({ error: `Failed to Boost Shares Post Link: ${shareUrl}\n\nThe Token is no longer valid or temporary restricted! please replace with new token!` });
      }
    }, timeInterval);
  });
}

async function deletePost(postId, accessToken) {
  try {
    await axios.delete(`https://graph.facebook.com/${postId}?access_token=${accessToken}`);
    console.log(`Post deleted: ${postId}`);
  } catch (error) {
    console.error('Failed to delete post!');
  }
}

module.exports = { sharePost };
        