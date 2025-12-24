<template>
  <section>
    <article class="prose" style="margin-bottom: 1rem;">
      <h1>Blog Posts</h1>
      <p>This are my recent blog posts</p>
    </article>
    <article v-for="post in posts" :key="post.path" class="prose" style="margin-bottom: 1rem;">
      <header>
        <div v-if="post.date">{{ post.date }}</div>
        <h2><nuxt-link :to="post.path">{{ post.title }}</nuxt-link></h2>
      </header>
      <main v-if="post.paragraphs && post.paragraphs.length > 0">
        <p v-for="(paragraph, idx) in post.paragraphs" :key="idx">
          {{ paragraph }}
        </p>
      </main>
      <footer>
        <span v-if="post.categories && post.categories.length > 0">
          <b>Categories: </b>
          <span v-for="category in post.categories" :key="category">{{ category }}, </span>
        </span>
        <span v-if="post.tags && post.tags.length > 0">
          <b>Tags: </b>
          <span v-for="tag in post.tags" :key="tag">{{ tag }}, </span>
        </span>
        <br v-if="(post.categories && post.categories.length > 0) || (post.tags && post.tags.length > 0)" />
        <nuxt-link :to="post.path">read more</nuxt-link>
      </footer>
    </article>
  </section>
</template>

<script setup>

useSeoMeta({
  title: 'mjk @ web',
  description: 'Blog posts about web development, programming, and other stuff',
  ogTitle: 'mjk @ web',
  ogDescription: 'Blog posts about web development, programming, and other stuff',
  ogImage: '/logo_518x270.png',
  ogUrl: 'http://www.mjkweb.de',
  twitterTitle: 'mjk @ web',
  twitterDescription: 'Blog posts about web development, programming, and other stuff',
  twitterImage: '/logo_200x200.png',
  twitterCard: 'summary'
})

useHead({
  htmlAttrs: {
    lang: 'en'
  },
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }
  ]
})

// Prüfe, ob wir im Prerender/Generate-Modus sind
const isPrerendering = import.meta.prerender || 
                       process.env.NITRO_PRESET === 'static'

const { data } = await useAsyncData(
  'blog-list',
   async () => {
     // Versuche body explizit abzurufen
     const allPosts = await queryCollection('blog')
       .all()
     
     
     // Filtere Drafts im Code, nur beim Generate (Prerender)
     let filtered = allPosts
     if (isPrerendering) {
       filtered = allPosts.filter(post => {
         // Prüfe auf draft: true im Frontmatter
         const draft = post.draft || post.meta?.draft
         // Prüfe auf Pfad im drafts Ordner
         const isInDraftsFolder = post.path?.includes('/drafts/')
         return !draft && !isInDraftsFolder
       })
     }
     
     // Sortiere nach Datum (neueste zuerst)
     // Erstelle eine Kopie des Arrays, da sort() das Original mutiert
     const sorted = [...filtered].sort((a, b) => {
       const dateA = a.date ? new Date(a.date) : new Date(0)
       const dateB = b.date ? new Date(b.date) : new Date(0)
       
       // Wenn Datum ungültig, ans Ende sortieren
       if (isNaN(dateA.getTime())) return 1
       if (isNaN(dateB.getTime())) return -1
       
       // Neueste zuerst (absteigend): dateB - dateA
       return dateB.getTime() - dateA.getTime()
     })
     
     return sorted
   }
)

const posts = computed(() => {
  if (!data.value) {
    return []
  }
  
  return data.value.map((post, index) => {
    // Die Felder sind direkt verfügbar (nicht unter meta)
    const excerpt = post.excerpt
    let paragraphs = []
    
    
    // Versuche immer, Paragraphs aus body zu extrahieren, wenn excerpt nicht korrekt ist
    // In Nuxt Content 3.0 ist body eine AST-Struktur
    if (post.body) {
      // Extrahiere nur den Teil vor <!-- EXCERPT_END --> oder <!--more-->
      paragraphs = extractParagraphsFromBody(post.body)
    }
    
    // Falls keine Paragraphs gefunden wurden, versuche excerpt zu verwenden
    if (paragraphs.length === 0 && excerpt && excerpt !== '[object Object]') {
      // Versuche verschiedene Excerpt-Formate
      // In Nuxt Content 3.0 ist excerpt immer eine AST-Struktur
      paragraphs = extractParagraphs(excerpt)
    }
    
    // Stelle sicher, dass paragraphs nur Strings enthält
    // Wenn paragraphs bereits ein Array von Strings ist (z.B. von String.split),
    // behalte es so. Sonst flache Arrays ab und konvertiere alle zu Strings.
    if (Array.isArray(paragraphs)) {
      // Prüfe ob alle Elemente bereits Strings sind
      const allStrings = paragraphs.every(p => typeof p === 'string')
      
      if (allStrings) {
        // Alle sind bereits Strings, filtere nur leere heraus
        // Da typeof bereits 'string' bestätigt, sollten diese primitiv sein
        paragraphs = paragraphs.filter(p => {
          // Filtere nur leere Strings heraus
          if (!p) return false
          if (typeof p !== 'string') return false
          const trimmed = p.trim()
          if (trimmed.length === 0) return false
          if (trimmed === '[object Object]') return false
          return true
        })
      } else {
        // Nicht alle sind Strings, flache und konvertiere
        const flattened = []
        
        function flattenArray(arr) {
          if (!Array.isArray(arr)) {
            arr = [arr]
          }
          
          for (const item of arr) {
            if (Array.isArray(item)) {
              flattenArray(item)
            } else if (typeof item === 'string') {
              if (item.trim().length > 0 && item !== '[object Object]') {
                flattened.push(item.trim())
              }
            } else if (typeof item === 'object' && item !== null) {
              // Wenn es ein Objekt ist, versuche Text zu extrahieren
              if (item.value && typeof item.value === 'string') {
                flattened.push(item.value.trim())
              } else if (item.type === 'text' && item.value) {
                flattened.push(String(item.value).trim())
              } else {
                // Versuche es zu konvertieren, aber ignoriere [object Object]
                const str = String(item)
                if (str !== '[object Object]' && str.trim().length > 0) {
                  flattened.push(str.trim())
                }
              }
            }
          }
        }
        
        flattenArray(paragraphs)
        paragraphs = flattened.filter(p => p && typeof p === 'string' && p.trim().length > 0)
      }
    } else {
      paragraphs = []
    }
    
    const preview = {
      ...post,
      date: formatDate(post.date),
      paragraphs: paragraphs,
      tags: post.tags || [],
      categories: post.categories || []
    }
    return preview
  })
})

function formatDate(dateString) {
  if (!dateString) {
    return ''
  }
  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    return ''
  }
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: '2-digit', 
    year: 'numeric' 
  }).format(date)
}

function extractParagraphsFromBody(body) {
  if (!body) return []
  
  const paragraphs = []
  let foundMoreSeparator = false
  
  // Rekursive Funktion zum Extrahieren von Text aus AST-Knoten
  function extractTextFromNode(node) {
    if (!node || typeof node !== 'object') return ''
    
    // Wenn es direkt Text ist
    if (node.type === 'text' && typeof node.value === 'string') {
      return node.value
    }
    
    // Wenn es children hat, rekursiv Text extrahieren
    if (node.children && Array.isArray(node.children)) {
      const textParts = node.children
        .map(child => {
          if (child && typeof child === 'object') {
            return extractTextFromNode(child)
          }
          return ''
        })
        .filter(part => typeof part === 'string' && part.length > 0)
      
      return textParts.join(' ')
    }
    
    return ''
  }
  
  // Funktion zum Prüfen, ob ein Knoten <!--more--> enthält
  function checkForMoreSeparator(node) {
    if (!node || foundMoreSeparator) return false
    
    // Wenn node ein Array ist (hast-Struktur: [tag, props, children])
    if (Array.isArray(node)) {
      const tag = node[0]
      const children = node[2]
      
      // Prüfe auf comment/html tags
      if (tag === 'comment' || tag === 'html') {
        let commentText = ''
        if (typeof children === 'string') {
          commentText = children
        } else if (Array.isArray(children) && children.length > 0) {
          if (typeof children[0] === 'string') {
            commentText = children[0]
          }
        }
        if (commentText && commentText.includes('<!--more-->')) {
          foundMoreSeparator = true
          return true
        }
      }
      
      // Rekursiv durch children prüfen
      if (Array.isArray(children)) {
        for (const child of children) {
          if (checkForMoreSeparator(child)) {
            return true
          }
        }
      }
    } else if (typeof node === 'object' && node !== null) {
      // Normale AST-Struktur
      if (node.type === 'html' && typeof node.value === 'string' && node.value.includes('<!--more-->')) {
        foundMoreSeparator = true
        return true
      }
      
      if (node.children && Array.isArray(node.children)) {
        for (const child of node.children) {
          if (checkForMoreSeparator(child)) {
            return true
          }
        }
      }
    }
    
    return false
  }
  
  // Durchlaufe die AST-Struktur und sammle Paragraphs bis zum <!--more--> Separator
  function traverseNode(node) {
    if (!node || foundMoreSeparator) return
    
    // Wenn node ein Array ist (hast-Struktur: [tag, props, children])
    if (Array.isArray(node)) {
      const tag = node[0]
      const children = node[2]
      
      // WICHTIG: Prüfe zuerst alle children auf <!--more--> BEVOR Paragraphs extrahiert werden
      if (Array.isArray(children) && !foundMoreSeparator) {
        // Erste Runde: Suche nach <!--more--> in allen children
        for (let i = 0; i < children.length; i++) {
          const child = children[i]
          
          // Prüfe direkt auf comment/html tags in children
          if (Array.isArray(child)) {
            const childTag = child[0]
            if (childTag === 'comment' || childTag === 'html') {
              const childChildren = child[2]
              let childText = ''
              if (typeof childChildren === 'string') {
                childText = childChildren
              } else if (Array.isArray(childChildren) && childChildren.length > 0) {
                if (typeof childChildren[0] === 'string') {
                  childText = childChildren[0]
                }
              }
              if (childText && childText.includes('<!--more-->')) {
                foundMoreSeparator = true
                // Stoppe vor diesem Knoten
                break
              }
            }
          }
          
          // Prüfe rekursiv
          if (checkForMoreSeparator(child)) {
            foundMoreSeparator = true
            break
          }
        }
      }
      
      // Wenn <!--more--> gefunden wurde, stoppe hier
      if (foundMoreSeparator) return
      
      // Wenn es ein Paragraph-Tag ist und noch kein <!--more--> gefunden wurde
      if (tag === 'p' && !foundMoreSeparator) {
        const text = extractTextFromHastNode(node)
        if (text && typeof text === 'string' && text.trim().length > 0) {
          // Prüfe, ob der Text <!--more--> enthält
          if (text.includes('<!--more-->')) {
            // Teile den Text bei <!--more--> und nimm nur den ersten Teil
            const parts = text.split('<!--more-->')
            if (parts[0] && parts[0].trim().length > 0) {
              paragraphs.push(parts[0].trim())
            }
            foundMoreSeparator = true
          } else {
            paragraphs.push(text.trim())
          }
        }
      }
      
      // Rekursiv durch children gehen (nur wenn noch kein <!--more--> gefunden wurde)
      if (Array.isArray(children) && !foundMoreSeparator) {
        for (const child of children) {
          if (foundMoreSeparator) break
          traverseNode(child)
        }
      }
      return
    }
    
    // Normale AST-Struktur (Objekt mit type, children, etc.)
    if (typeof node !== 'object') return
    
    // Wenn es ein HTML-Kommentar mit <!--more--> ist, stoppe die Extraktion
    if (node.type === 'html' && typeof node.value === 'string' && node.value.includes('<!--more-->')) {
      foundMoreSeparator = true
      return
    }
    
    // Prüfe auch auf HTML-Kommentare in children
    if (node.children && Array.isArray(node.children)) {
      for (const child of node.children) {
        if (child && typeof child === 'object' && child.type === 'html' && 
            typeof child.value === 'string' && child.value.includes('<!--more-->')) {
          foundMoreSeparator = true
          return
        }
      }
    }
    
    // Wenn es ein Paragraph-Knoten ist
    if (node.type === 'paragraph') {
      const text = extractTextFromNode(node)
      if (text && typeof text === 'string' && text.trim().length > 0) {
        paragraphs.push(text.trim())
      }
    }
    
    // Wenn es ein Element mit tag 'p' ist (alte AST-Struktur)
    if (node.type === 'element' && node.tag === 'p') {
      const text = extractTextFromNode(node)
      if (text && typeof text === 'string' && text.trim().length > 0) {
        paragraphs.push(text.trim())
      }
    }
    
    // Wenn es children hat, rekursiv durchgehen
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(child => {
        if (child && typeof child === 'object' && !foundMoreSeparator) {
          traverseNode(child)
        }
      })
    }
  }
  
  // Funktion zum Extrahieren von Text aus hast-Knoten ([tag, props, children])
  function extractTextFromHastNode(node) {
    if (!node || !Array.isArray(node)) return ''
    
    const children = node[2]
    if (!children) return ''
    
    if (typeof children === 'string') {
      return children
    }
    
    if (Array.isArray(children)) {
      const textParts = []
      for (const child of children) {
        if (typeof child === 'string') {
          textParts.push(child)
        } else if (Array.isArray(child)) {
          const text = extractTextFromHastNode(child)
          if (text) {
            textParts.push(text)
          }
        }
      }
      return textParts
        .filter(part => typeof part === 'string' && part.length > 0)
        .join(' ')
    }
    
    return ''
  }
  
  // Wenn body ein Array ist, durchlaufe jeden Knoten
  if (Array.isArray(body)) {
    body.forEach(node => {
      if (node && typeof node === 'object' && !foundMoreSeparator) {
        traverseNode(node)
      }
    })
  } else if (typeof body === 'object' && body !== null) {
    // Wenn body ein Objekt ist, finde den root-Knoten
    // In Nuxt Content 3.0 hat body eine value-Property mit der AST-Struktur
    if (body.value) {
      // body.value ist die eigentliche AST-Struktur
      if (Array.isArray(body.value)) {
        // body.value ist direkt ein Array von AST-Knoten
        // WICHTIG: Durchlaufe sequenziell und extrahiere Paragraphs bis zum Separator
        const SEPARATORS = [
          '<!-- EXCERPT_END -->',
          '<!--more-->',
          'EXCERPT_END',
          '<!--more'
        ]
        
        
        for (let i = 0; i < body.value.length; i++) {
          const node = body.value[i]
          if (!node || typeof node !== 'object') continue
          
          if (Array.isArray(node)) {
            const tag = node[0]
            const children = node[2]
            
            // Prüfe zuerst auf comment/html tags (Separator könnte als separater Knoten existieren)
            if (tag === 'comment' || tag === 'html') {
              let commentText = ''
              if (typeof children === 'string') {
                commentText = children
              } else if (Array.isArray(children)) {
                // Versuche Text aus children zu extrahieren
                for (const child of children) {
                  if (typeof child === 'string') {
                    commentText = child
                    break
                  } else if (Array.isArray(child) && child.length > 2) {
                    const deepChild = child[2]
                    if (typeof deepChild === 'string') {
                      commentText = deepChild
                      break
                    }
                  }
                }
              }
              
              // Prüfe auf Separator
              for (const sep of SEPARATORS) {
                if (commentText && commentText.includes(sep)) {
                  // Separator gefunden, stoppe hier
                  return paragraphs.filter(p => p && typeof p === 'string' && p.trim().length > 0)
                }
              }
            }
            
            // Prüfe auch auf h2/h3/etc. Tags - diese könnten nach dem Separator kommen
            // Wenn nach Paragraphs ein Heading kommt, könnte der Separator dazwischen sein
            if ((tag === 'h2' || tag === 'h3' || tag === 'h4' || tag === 'h5' || tag === 'h6') && paragraphs.length > 0) {
              // Wenn wir bereits Paragraphs haben und ein Heading kommt, könnte der Separator dazwischen sein
              // Stoppe hier
              break
            }
            
            // Wenn es ein Paragraph-Knoten ist, extrahiere den Text
            if (tag === 'p') {
              const text = extractTextFromHastNode(node)
              if (text && typeof text === 'string' && text.trim().length > 0) {
                // Prüfe, ob der Text einen Separator enthält
                let separatorFound = false
                let separator = ''
                
                for (const sep of SEPARATORS) {
                  if (text.includes(sep)) {
                    separatorFound = true
                    separator = sep
                    break
                  }
                }
                
                if (separatorFound) {
                  // Teile den Text bei dem Separator
                  const parts = text.split(separator)
                  if (parts[0] && parts[0].trim().length > 0) {
                    paragraphs.push(parts[0].trim())
                  }
                  // Stoppe hier
                  break
                } else {
                  paragraphs.push(text.trim())
                }
              }
            }
          } else if (typeof node === 'object') {
            // Normale AST-Struktur
            if (node.type === 'html' || node.type === 'comment') {
              const htmlValue = node.value || node.data || ''
              
              // Prüfe auf Separator
              for (const sep of SEPARATORS) {
                if (htmlValue && typeof htmlValue === 'string' && htmlValue.includes(sep)) {
                  // Separator gefunden, stoppe hier
                  return paragraphs.filter(p => p && typeof p === 'string' && p.trim().length > 0)
                }
              }
            }
            
            // Prüfe auch auf Heading-Knoten in Objekt-Struktur
            if ((node.type === 'heading' || node.type === 'h2' || node.type === 'h3' || node.type === 'h4' || node.type === 'h5' || node.type === 'h6') && paragraphs.length > 0) {
              // Wenn wir bereits Paragraphs haben und ein Heading kommt, könnte der Separator dazwischen sein
              // Stoppe hier
              break
            }
            
            // Nur Paragraphs extrahieren
            if (node.type === 'paragraph') {
              const text = extractTextFromNode(node)
              if (text && typeof text === 'string' && text.trim().length > 0) {
                // Prüfe auf Separator
                let separatorFound = false
                for (const sep of SEPARATORS) {
                  if (text.includes(sep)) {
                    const parts = text.split(sep)
                    if (parts[0] && parts[0].trim().length > 0) {
                      paragraphs.push(parts[0].trim())
                    }
                    separatorFound = true
                    break
                  }
                }
                if (!separatorFound) {
                  paragraphs.push(text.trim())
                } else {
                  break
                }
              }
            }
          }
        }
        
      } else if (typeof body.value === 'object' && body.value !== null) {
        // body.value ist ein Objekt
        if (body.value.children && Array.isArray(body.value.children)) {
          body.value.children.forEach(child => {
            if (child && typeof child === 'object' && !foundMoreSeparator) {
              traverseNode(child)
            }
          })
        } else {
          traverseNode(body.value)
        }
      }
    } else if (body.children && Array.isArray(body.children)) {
      // Fallback: versuche body.children
      body.children.forEach(child => {
        if (child && typeof child === 'object' && !foundMoreSeparator) {
          traverseNode(child)
        }
      })
    } else {
      // Fallback: versuche direkt zu traversieren
      traverseNode(body)
    }
  }
  
  // Stelle sicher, dass nur Strings zurückgegeben werden
  return paragraphs.filter(p => p && typeof p === 'string' && p.trim().length > 0)
}

function extractParagraphs(excerpt) {
  if (!excerpt) return []
  
  // Wenn excerpt ein String ist, versuche es zu splitten
  if (typeof excerpt === 'string') {
    try {
      const splitResult = excerpt.split('\n\n')
      // Prüfe ob split() tatsächlich ein Array zurückgibt
      if (Array.isArray(splitResult) && splitResult.length > 0) {
        return splitResult.filter(p => p && p.trim().length > 0)
      }
    } catch (e) {
      // Falls split() fehlschlägt, behandle es als AST
    }
  }
  
  // Wenn excerpt ein Array ist (Nuxt Content 3.0 - Array von Knoten)
  const paragraphs = []
  
  // Rekursive Funktion zum Extrahieren von Text aus AST-Knoten
  function extractTextFromNode(node) {
    if (!node || typeof node !== 'object') return ''
    
    // Wenn es direkt Text ist
    if (node.type === 'text' && typeof node.value === 'string') {
      return node.value
    }
    
    // Wenn es children hat, rekursiv Text extrahieren
    if (node.children && Array.isArray(node.children)) {
      const textParts = node.children
        .map(child => {
          if (child && typeof child === 'object') {
            return extractTextFromNode(child)
          }
          return ''
        })
        .filter(part => typeof part === 'string' && part.length > 0)
      
      return textParts.join(' ')
    }
    
    return ''
  }
  
  // Durchlaufe die AST-Struktur und sammle Paragraphs
  function traverseNode(node) {
    if (!node || typeof node !== 'object') return
    
    // Wenn es ein Paragraph-Knoten ist
    if (node.type === 'paragraph') {
      const text = extractTextFromNode(node)
      if (text && typeof text === 'string' && text.trim().length > 0) {
        paragraphs.push(text.trim())
      }
    }
    
    // Wenn es ein Element mit tag 'p' ist (alte AST-Struktur)
    if (node.type === 'element' && node.tag === 'p') {
      const text = extractTextFromNode(node)
      if (text && typeof text === 'string' && text.trim().length > 0) {
        paragraphs.push(text.trim())
      }
    }
    
    // Wenn es children hat, rekursiv durchgehen
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(child => {
        if (child && typeof child === 'object') {
          traverseNode(child)
        }
      })
    }
  }
  
  // Wenn excerpt ein Array ist, durchlaufe jeden Knoten
  if (Array.isArray(excerpt)) {
    excerpt.forEach(node => {
      if (node && typeof node === 'object') {
        traverseNode(node)
      }
    })
  } else if (typeof excerpt === 'object' && excerpt !== null) {
    // Wenn excerpt ein Objekt ist, finde den root-Knoten
    // Prüfe verschiedene mögliche Strukturen
    if (excerpt.body && excerpt.body.children) {
      traverseNode(excerpt.body)
    } else if (excerpt.children) {
      traverseNode(excerpt)
    } else {
      traverseNode(excerpt)
    }
  } else if (typeof excerpt === 'string') {
    // Falls es doch ein String ist, versuche es zu splitten
    const splitResult = excerpt.split('\n\n')
    if (Array.isArray(splitResult)) {
      return splitResult.filter(p => p && p.trim().length > 0)
    }
  }
  
  // Stelle sicher, dass nur Strings zurückgegeben werden
  return paragraphs.filter(p => p && typeof p === 'string' && p.trim().length > 0)
}

</script>