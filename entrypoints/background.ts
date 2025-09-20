import { defineBackground } from '#imports'
import { browser } from 'wxt/browser'

type EngineUrlMap = {
  [key in SearchEngineName]: {
    api: string
    url: string
  }
}

const SEARCH_ENGINE_MAP: EngineUrlMap = {
  google: {
    api: 'https://suggestqueries.google.com/complete/search?client=chrome&q=',
    url: 'https://www.google.com/search?q=',
  },
  bing: {
    api: 'https://api.bing.com/osjson.aspx?q=',
    url: 'https://www.bing.com/search?q=',
  },
}

async function getSearchSuggestionList(searchEngine: SearchEngineName = 'bing', query = '') {
  try {
    if (searchEngine === 'google' && query.trim() === '') return []

    const response = await fetch(SEARCH_ENGINE_MAP[searchEngine].api + encodeURIComponent(query), {
      method: 'get',
    })
    const data = await response.json()
    return data[1] || []
  } catch (error) {
    console.error('Error fetching search suggestions:', error)
    return []
  }
}

async function toSearchEngineUrl(
  searchEngine: SearchEngineName = 'bing',
  query = '',
  active = false,
) {
  const q = encodeURIComponent(query)
  if (q.trim() === '') return
  const url = SEARCH_ENGINE_MAP[searchEngine].url + q
  if (active) {
    browser.tabs.create({
      url,
      active,
    })
  } else {
    browser.tabs.update({
      url,
      active,
    })
  }
}

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((messages: any, sender, sendResponse) => {
    const { action, searchEngine, query, active } = messages
    switch (action) {
      case 'getSearchSuggestions':
        getSearchSuggestionList(searchEngine, query)
          .then((suggestions) => sendResponse(suggestions))
          .catch(() => sendResponse([]))
        break
      case 'toSearchEngineUrl':
        toSearchEngineUrl(searchEngine, query, active)
        sendResponse({ response: 'success' })
        break

      default:
        sendResponse({ response: `unknown action: ${action}` })
        break
    }

    return true
  })
})
