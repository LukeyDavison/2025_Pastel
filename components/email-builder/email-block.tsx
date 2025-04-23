"use client"

import { useState, useRef, useEffect } from "react"
import type { BlockContent } from "@/contexts/email-builder-context"
import { useEmailBuilder } from "@/contexts/email-builder-context"
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react"

interface EmailBlockProps {
  block: BlockContent
}

export function EmailBlock({ block }: EmailBlockProps) {
  const { updateBlock } = useEmailBuilder()
  const [editableContent, setEditableContent] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 })
  const [showToolbar, setShowToolbar] = useState(false)

  useEffect(() => {
    // Function to handle clicks outside the editor
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isEditing &&
        editorRef.current &&
        !editorRef.current.contains(event.target as Node) &&
        toolbarRef.current &&
        !toolbarRef.current.contains(event.target as Node)
      ) {
        // Save content when clicking outside
        handleSaveContent()
      }
    }

    // Add event listener when editing
    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isEditing])

  const handleDoubleClick = () => {
    if (block.type === "title" || block.type === "paragraph") {
      setIsEditing(true)
      setEditableContent(block.content)

      // Position the toolbar after a short delay to ensure the element is rendered
      setTimeout(() => {
        if (editorRef.current) {
          const rect = editorRef.current.getBoundingClientRect()
          const scrollTop = window.scrollY || document.documentElement.scrollTop

          setToolbarPosition({
            top: rect.top + scrollTop - 50,
            left: rect.left + rect.width / 2 - 150,
          })
          setShowToolbar(true)
        }
      }, 50)
    }
  }

  const handleSaveContent = () => {
    if (isEditing && editorRef.current) {
      const content = editorRef.current.innerHTML
      updateBlock(block.id, content)
      setIsEditing(false)
      setShowToolbar(false)
    }
  }

  const applyFormatting = (command: string, value?: string) => {
    document.execCommand(command, false, value)

    if (editorRef.current) {
      // Update the editable content after formatting
      setEditableContent(editorRef.current.innerHTML)
    }
  }

  const renderBlock = () => {
    switch (block.type) {
      case "title":
        return isEditing ? (
          <div
            ref={editorRef}
            contentEditable
            dangerouslySetInnerHTML={{ __html: editableContent }}
            style={{
              fontSize: block.styles.fontSize,
              fontWeight: block.styles.fontWeight,
              color: block.styles.color,
              textAlign: block.styles.textAlign as any,
              fontFamily: block.styles.fontFamily,
              padding: block.styles.padding,
              outline: "none",
              border: "2px dashed #7747ff",
              borderRadius: "4px",
            }}
          />
        ) : (
          <h1
            style={{
              fontSize: block.styles.fontSize,
              fontWeight: block.styles.fontWeight,
              color: block.styles.color,
              textAlign: block.styles.textAlign as any,
              fontFamily: block.styles.fontFamily,
              padding: block.styles.padding,
            }}
            onDoubleClick={handleDoubleClick}
            dangerouslySetInnerHTML={{ __html: block.content }}
          />
        )

      case "paragraph":
        return isEditing ? (
          <div
            ref={editorRef}
            contentEditable
            dangerouslySetInnerHTML={{ __html: editableContent }}
            style={{
              fontSize: block.styles.fontSize,
              color: block.styles.color,
              textAlign: block.styles.textAlign as any,
              fontFamily: block.styles.fontFamily,
              lineHeight: block.styles.lineHeight,
              padding: block.styles.padding,
              outline: "none",
              border: "2px dashed #7747ff",
              borderRadius: "4px",
            }}
          />
        ) : (
          <p
            style={{
              fontSize: block.styles.fontSize,
              color: block.styles.color,
              textAlign: block.styles.textAlign as any,
              fontFamily: block.styles.fontFamily,
              lineHeight: block.styles.lineHeight,
              padding: block.styles.padding,
            }}
            onDoubleClick={handleDoubleClick}
            dangerouslySetInnerHTML={{ __html: block.content }}
          />
        )

      case "image":
        if (block.content.columns && block.content.columns > 1 && block.content.images) {
          return (
            <div
              style={{
                textAlign: block.styles.align as any,
                padding: "10px",
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {block.content.images.map((image: any, index: number) => (
                <div
                  key={index}
                  style={{
                    width: `${100 / block.content.columns}%`,
                    padding: "5px",
                    boxSizing: "border-box",
                  }}
                >
                  <img
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    style={{
                      width: "100%",
                      borderRadius: block.styles.borderRadius,
                    }}
                  />
                </div>
              ))}
            </div>
          )
        } else {
          return (
            <div
              style={{
                textAlign: block.styles.align as any,
                padding: "10px",
              }}
            >
              <img
                src={block.content.src || "/placeholder.svg"}
                alt={block.content.alt}
                style={{
                  width: block.styles.width,
                  borderRadius: block.styles.borderRadius,
                }}
              />
            </div>
          )
        }

      case "button":
        return (
          <div
            style={{
              textAlign: (block.styles.textAlign || "center") as any,
              padding: "10px",
            }}
          >
            <a
              href={block.content.url}
              style={{
                display: "inline-block",
                backgroundColor: block.styles.backgroundColor,
                color: block.styles.color,
                padding: block.styles.padding,
                borderRadius: block.styles.borderRadius,
                textDecoration: "none",
                fontFamily: block.styles.fontFamily,
                fontWeight: block.styles.fontWeight,
              }}
            >
              {block.content.text}
            </a>
          </div>
        )

      case "divider":
        return (
          <div style={{ padding: block.styles.padding }}>
            <hr
              style={{
                border: "none",
                height: block.styles.height,
                backgroundColor: block.styles.color,
                margin: 0,
              }}
            />
          </div>
        )

      case "spacer":
        return <div style={{ height: block.styles.height }}></div>

      case "social":
        return (
          <div
            style={{
              textAlign: block.styles.align as any,
              padding: "10px",
            }}
          >
            {block.content.networks.map((network: any, index: number) => (
              <a
                key={index}
                href={network.url}
                style={{
                  display: "inline-block",
                  margin: `0 ${block.styles.iconSpacing}`,
                }}
              >
                {renderSocialIcon(network.name, block.styles.iconSize)}
              </a>
            ))}
          </div>
        )

      case "html":
        return (
          <div style={{ padding: block.styles.padding }} dangerouslySetInnerHTML={{ __html: block.content.code }} />
        )

      case "product":
        return (
          <div
            style={{
              padding: block.styles.padding,
              backgroundColor: block.styles.backgroundColor || "#ffffff",
              borderRadius: block.styles.borderRadius || "0",
              textAlign: (block.styles.textAlign as any) || "center",
            }}
          >
            <div className="flex flex-wrap">
              {block.content.products.slice(0, block.content.columns).map((product: any, index: number) => (
                <div key={index} className="p-2" style={{ width: `${100 / block.content.columns}%` }}>
                  <img
                    src={product.selectedImage || product.media?.default?.src || product.imageUrl || "/placeholder.svg"}
                    alt={product.titles?.default || product.name || "Product"}
                    className="w-full h-auto"
                  />

                  {block.content.showName && (
                    <h3 className="mt-2 mb-1 font-bold text-sm">
                      {product.titles?.default || product.name || "Product"}
                    </h3>
                  )}

                  {block.content.showPrice && (
                    <p className="text-sm">
                      £{product.pricing.price.toFixed(2)}
                      {product.pricing.was && (
                        <span className="ml-1 text-red-500 line-through">£{product.pricing.was.toFixed(2)}</span>
                      )}
                    </p>
                  )}

                  {block.content.showSwatch &&
                    product.properties?.swatches &&
                    product.properties.swatches.length > 0 && (
                      <div className="flex mt-1 space-x-1">
                        {product.properties.swatches.map((swatch: any) => (
                          <span
                            key={swatch.id}
                            className="inline-block w-3 h-3 rounded-full"
                            style={{ backgroundColor: swatch.hex }}
                            title={swatch.colour}
                          />
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const renderSocialIcon = (name: string, size: string) => {
    const iconSize = Number.parseInt(size) || 24

    switch (name.toLowerCase()) {
      case "facebook":
        return <Facebook size={iconSize} />
      case "twitter":
        return <Twitter size={iconSize} />
      case "instagram":
        return <Instagram size={iconSize} />
      case "linkedin":
        return <Linkedin size={iconSize} />
      case "youtube":
        return <Youtube size={iconSize} />
      case "github":
        return <Github size={iconSize} />
      default:
        return null
    }
  }

  return (
    <div className="relative group">
      {renderBlock()}

      {showToolbar && isEditing && (
        <div
          ref={toolbarRef}
          className="fixed bg-indigo-600 text-white rounded-md shadow-lg p-2 flex items-center space-x-2 z-50"
          style={{
            top: `${toolbarPosition.top}px`,
            left: `${toolbarPosition.left}px`,
          }}
        >
          <button onClick={() => applyFormatting("bold")} className="p-1 hover:bg-indigo-700 rounded">
            <Bold size={16} />
          </button>
          <button onClick={() => applyFormatting("italic")} className="p-1 hover:bg-indigo-700 rounded">
            <Italic size={16} />
          </button>
          <button onClick={() => applyFormatting("underline")} className="p-1 hover:bg-indigo-700 rounded">
            <Underline size={16} />
          </button>
          <div className="w-px h-6 bg-indigo-400 mx-1"></div>
          <button onClick={() => applyFormatting("justifyLeft")} className="p-1 hover:bg-indigo-700 rounded">
            <AlignLeft size={16} />
          </button>
          <button onClick={() => applyFormatting("justifyCenter")} className="p-1 hover:bg-indigo-700 rounded">
            <AlignCenter size={16} />
          </button>
          <button onClick={() => applyFormatting("justifyRight")} className="p-1 hover:bg-indigo-700 rounded">
            <AlignRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
