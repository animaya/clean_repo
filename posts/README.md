# 🎯 **Marketing Posting Factory - User Guide**

## **How to Use Your Marketing Posting Factory**

### **Step 1: Make a Content Request**
Simply say something like:
- *"I need content about [your topic]"*
- *"Create posts about AI helping small businesses"*
- *"I want to share tips on productivity for entrepreneurs"*

### **Step 2: Answer the Questions**
The Router Agent will ask you questions like:

**Platform Selection:**
- Which platforms? (LinkedIn, Twitter, Instagram, Facebook, TikTok)

**Audience:**
- Who is your target audience? (It will reference your personas when you customize them)

**Goals:**
- What's your primary goal? (Brand awareness, engagement, lead generation, etc.)

**Visual Content:**
- Do you need visual content? Say **"Yes, generate JSON prompt for image generation"**

**Style:**
- What tone? (Professional, conversational, educational, etc.)

### **Step 3: Review Content Options**
You'll get 3-5 content variations per platform, like:

```
## LinkedIn Content Variations for: [Your Topic]

### Variation 1: Professional Insight
[Content with professional tone and industry data]

### Variation 2: Personal Story 
[Content with storytelling approach]

### Variation 3: Educational Tips
[Content with actionable advice]
```

### **Step 4: Select Your Preferred Content**
Just say:
- *"I like LinkedIn Variation 2"*
- *"Use Instagram Variation 1 and Twitter Variation 3"*
- *"Go with the professional approach for LinkedIn"*

### **Step 5: Get Your Complete Package**
You'll receive:

#### **📝 Final Approved Content**
```
Your selected social media post text, optimized for each platform
```

#### **🎨 JSON Visual Prompt**
```json
{
  "task": "text-to-image",
  "safety": "adult (18+), SFW",
  "style": "professional cinematic realism",
  "aspect_ratio": "1.91:1",
  "description": "[Detailed scene description matching your content]",
  "camera": { ... },
  "lighting": { ... },
  "color_grading": { ... },
  "visual_rules": [ ... ],
  "negative_prompt": [ ... ],
  "output": {"resolution": "high"}
}
```

### **Step 6: Use Your Content**
1. **Copy the text** → Paste into your social media platform
2. **Copy the JSON** → Use with your image generation tool (Midjourney, DALL-E, etc.)
3. **Post with generated image**

---

## **🔥 Example Request:**

**You:** *"I need content about time management for busy professionals, and I want professional visuals"*

**System:** *Asks questions → You answer → Generates variations → You select → Delivers content + JSON prompt*

**You get:** Ready-to-post content + professional image generation prompt

---

## **💡 Pro Tips:**

**For Multiple Platforms:**
- Say "LinkedIn and Instagram" to get optimized versions for both

**For Campaigns:**
- Say "I need a campaign about [topic]" for coordinated multi-platform content

**For Quick Posts:**
- Just say the topic and "LinkedIn, professional tone" for fast single-platform content

**For Visual Variety:**
- Ask for "multiple aspect ratios" to get square, landscape, and portrait options

---

## **🚀 System Architecture**

### **Core Components:**
- **CLAUDE.md** - System memory and context
- **Router Agent** - Intelligent orchestration and questioning
- **Platform Agents** - LinkedIn, Twitter, Instagram, Facebook, TikTok specialists
- **Style Agents** - Professional, casual, educational, inspirational approaches
- **Visual Prompt Agent** - Text-to-image JSON prompt generation
- **Brand Templates** - Customizable guidelines and preferences

### **Template Structure:**
```
brand/
├── brand-voice.md          # Your company tone and messaging
├── audience-personas.md    # Target audience definitions
├── visual-style.md        # Colors, fonts, image guidelines
├── platform-guidelines.md # Platform-specific requirements
└── successful-templates.md # Proven post formats

agents/
├── platform-agents.md     # Platform-specific configurations
├── style-agents.md       # Style-specific approaches
├── agent-coordination.md  # Multi-agent workflows
└── visual-prompt-agent.md # Image generation prompts

router-prompts.md          # Intelligent questioning system
workflow-templates.md      # TodoWrite orchestration patterns
```

---

## **🎛️ Customization Guide**

### **Step 1: Customize Brand Templates**
Edit these files with your actual company information:

1. **`brand/brand-voice.md`** - Add your company's tone, values, and messaging
2. **`brand/audience-personas.md`** - Define your target audiences
3. **`brand/visual-style.md`** - Add your colors, fonts, and visual preferences
4. **`brand/platform-guidelines.md`** - Set your platform-specific requirements
5. **`brand/successful-templates.md`** - Document what works for your brand

### **Step 2: Test and Iterate**
- Make content requests to test the system
- Update templates based on what works
- Refine agent behaviors through template adjustments

### **Step 3: Scale Usage**
- Use daily content workflows for regular posting
- Use campaign workflows for product launches
- Use batch workflows for weekly planning

---

## **🚀 Ready to Start:**
Just make any content request to see the system in action!

Example: *"I need LinkedIn content about productivity tips for entrepreneurs with professional visuals"*