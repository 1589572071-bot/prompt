# 数字人行为编排工作台 Orchestration Studio PRD

## 1. 文档概述

### 1.1 产品背景

当前数字人实时生成链路采用“多状态、多分支”的混合驱动架构。Prompt 相关配置分散在文档、代码、数据库和运营配置中，导致版本割裂、职责边界不清、算法与后端分支冲突严重，线上问题也难以完整还原。

Orchestration Studio 的目标是将 Prompt 管理从“离散文本维护”升级为一套可版本化、可编排、可预览、可发布、可追溯的数字人行为策略生产系统。

平台核心能力包括：

- 管理数字人的 Avatar Profile、Persona、System Base、业务策略和主动话术。
- 通过状态机画布替代后端硬编码状态分支。
- 通过固定顺序的 Prompt 三明治装配提升运行稳定性和 KV Cache 命中率。
- 在沙箱中预览最终 Full Prompt、Token 分布和策略命中情况。
- 在线上追溯中还原任意 Session / Turn 的真实 Prompt 快照。

### 1.2 产品目标

- 统一沉淀 Prompt 资产，避免文档、代码、数据库多处割裂维护。
- 让 PM / 运营可在权限范围内自助配置策略，减少研发介入。
- 通过 DAG 画布可视化定义数字人状态流转。
- 支持 Prompt 拼接结果全透明预览和上线前校验。
- 支持线上事故 100% 还原真实 Prompt 现场。
- 保证实时对话链路中 Prompt 组装时延满足低延迟要求。

### 1.3 核心设计理念

#### 资产版本化

System Base、Avatar Profile、Persona、业务策略、主动话术、状态机拓扑均应具备版本概念。发布后的版本不可直接覆盖，只能通过新版本变更。

#### 动静资产分离

将常驻的全局铁律、Avatar Profile、Persona、业务策略作为静态资产沉淀，将用户输入、主动触发、实时状态、History Buffer 作为动态上下文处理。

#### 配置即装配

通过可视化 DAG 画布定义状态流转和策略绑定关系，减少后端业务 `if-else` 分支。后端运行时只负责读取已发布配置并完成模板拼接。

#### 黑盒可视化

对 Prompt 拼接、主动策略增强、用户输入增强、动作缓冲和最终 Full Prompt 结果提供透明预览，降低调试成本。

---

## 2. 目标用户与权限边界

### 2.1 算法 / 后端工程师

负责系统底座、动作协议、输出格式、模型边界、Guardrails、运行性能和发布稳定性。

可编辑：

- Tab 1 全局基底中的算法铁律。
- System Base。
- Guardrails。
- 动作协议。
- 模板变量规范。

可查看：

- 全部 Tab。
- 全部版本。
- 线上追溯日志。

### 2.2 产品经理 / 策略 PM

负责 Avatar Profile、Persona、业务策略、状态机编排、沙箱验证和版本发布。

可编辑：

- Tab 1 中的业务策略仓库。
- Tab 2 角色中心 / Avatar Profile。
- Tab 3 状态编排。
- Tab 5 沙箱模拟。

可发起：

- 合并工单。
- 发布工单。
- 版本回滚申请。

### 2.3 运营人员

负责主动话术、触发规则、动作标签和日常策略配置。

可编辑：

- Tab 4 主动策略。

可查看：

- 其他 Tab 只读。

### 2.4 线上追溯权限

- Tab 6 默认只读。
- 历史 Prompt Snapshot 不允许编辑。
- 涉及用户隐私的字段需按角色做脱敏展示。

---

## 3. 全局信息架构

平台保留 6 个一级 Tab，不新增第 7 个 Tab。

| Tab | 名称 | 核心职责 |
| --- | --- | --- |
| Tab 1 | 全局基底 | 管理 System Base、算法铁律、Guardrails、业务策略仓库 |
| Tab 2 | 角色中心 | 管理 Avatar Profile、Edit Avatar、默认外观、Persona、行为偏好 |
| Tab 3 | 状态编排 | 管理状态机 DAG、节点属性、连线规则、策略包绑定 |
| Tab 4 | 主动策略 | 管理 Proactive 触发规则、话术原子、动作 Token |
| Tab 5 | 沙箱模拟 | 展开 Full Prompt，进行仿真、热力图和 Token 检查 |
| Tab 6 | 线上追溯 | 查看线上真实 Prompt 快照、状态流转和耗时 |

---

## 4. 全局页面布局

### 4.1 四栏网格布局

工作台采用“左-左-中-右”四栏网格布局。

```text
+-----------------------------------------------------------------------------------------------+
|    | [Avatar: Serena v2.3] [环境: Dev | Staging | Prod] [版本状态] [保存草稿] [合并/发布工单] |
+----+------------------------------------------------------------------------------------------+
| Nav| 策略资产与原子库             | 主工作区 / 状态机画布                    | 属性配置与增强预览        |
|    |                              |                                          |                           |
|    | - 资产目录                   | - 编辑器                                 | - 表单属性                |
|    | - 版本列表                   | - React Flow 画布                         | - Prompt 预览             |
|    | - 节点/策略分组              | - 沙箱输入                               | - 校验结果                |
|    |                              | - 日志时序                               | - Debug 信息              |
+----+------------------------------------------------------------------------------------------+
```

布局建议：

- 最左侧全局导航栏：固定宽度 56px。
- 左侧二级资产栏：约 20%。
- 中间主工作区：约 50%。
- 右侧属性与预览栏：约 30%。

### 4.2 顶部全局上下文

顶部栏在所有 Tab 中保持一致，承载全局上下文：

- Avatar 选择器。
- Avatar 当前版本。
- 环境切换：Dev / Staging / Production。
- 当前配置状态：Draft / Pending Review / Published / Deprecated。
- 保存草稿。
- 沙箱验证。
- 合并 / 发布工单入口。

### 4.3 最左侧全局导航

全局导航使用 Icon + Tooltip 形式。

导航项：

- 全局基底。
- 角色中心。
- 状态编排。
- 主动策略。
- 沙箱模拟。
- 线上追溯。

点击导航后，右侧三栏整体切换到对应业务上下文，同时保留当前 Avatar、环境和版本上下文。

---

## 5. Tab 1：全局基底

### 5.1 模块定位

全局基底负责维护所有 Avatar 共用或高优先级的系统 Prompt 资产。

该 Tab 分为两组：

- 组 A：算法铁律 System Core。
- 组 B：业务策略仓库 Biz Strategies。

### 5.2 组 A：算法铁律 System Core

用于存放最高优先级系统规则，不允许被业务策略覆盖。

包含：

- 动作能力协议 Action Space。
- 输出格式约束。
- 合规与敏感内容 Guardrails。
- 异常兜底策略。
- 模型行为边界。
- 下游视频生成模型控制符规范。

示例：

```text
<Avatar_Action>
支持动作：点头(nod)、摇头(shake)、微笑(smile)。
输出时必须携带动作标签，如 [ACT:smile]。
</Avatar_Action>
```

Guardrails 示例：

```text
<Guardrails>
涉及合规或敏感内容时，统一回复固定拒答语，且动作强制为 [ACT:shake]。
</Guardrails>
```

前端组件建议：

- Monaco Editor。
- 变量校验。
- 发布前 Diff。
- 版本历史抽屉。

后端存储建议：

- MySQL Text 存储。
- Redis 强缓存已发布版本。
- 发布版本不可直接覆盖。

### 5.3 组 B：业务策略仓库 Biz Strategies

用于支持 PM / 运营根据业务场景扩展策略包，例如试衣、大促、直播导购、售后、节日活动等。

每个业务策略包包含：

- 策略名称。
- 策略类型。
- 启用状态。
- 适用 Avatar。
- 适用环境。
- 视觉锚定提示词。
- 姿态动作约束词。
- 核心商品 / 业务知识。
- 生效状态节点。
- 版本号。
- 发布状态。

示例：

```yaml
strategy_name: 试衣展示策略
visual_anchor: "象牙白真丝衬衫 + 藏青阔腿裤"
pose_constraints: "禁止高举双手防走光，推荐侧身15°展示剪裁"
knowledge_base: "真丝干洗，含5%氨纶抗皱"
enabled: true
```

前端组件建议：

- 结构化卡片表单。
- 策略包列表。
- 启用开关。
- 版本 Diff。
- 引用状态节点查看。

---

## 6. Tab 2：角色中心 / Avatar Profile

### 6.1 模块定位

Tab 2 负责管理完整的 Avatar Profile，而不只是 Persona 文本。

`Edit Avatar` 放入 Tab 2，作为角色中心下的核心编辑能力，不新增一级导航。

Avatar Profile 包含：

- Avatar 基础信息。
- 头像与卡片图。
- 默认视觉描述。
- 默认外观。
- Persona 人设。
- 可聊主题。
- 语言风格。
- 行为偏好。
- 边界约束。
- 示例交互。
- 版本与发布状态。

### 6.2 页面结构

Tab 2 采用三栏结构：

- 左侧资产栏：Avatar 列表、版本列表、Profile Sections。
- 中间主工作区：表单编辑与内容编辑。
- 右侧预览栏：Avatar 预览、Persona 拼接预览、校验结果。

左侧 Profile Sections：

- 基础信息。
- 形象资产。
- 默认外观。
- Persona。
- 语言风格。
- 行为偏好。
- 边界约束。
- 示例交互。

### 6.3 基础信息

字段：

- Avatar Name。
- Avatar ID。
- Gender。
- Age Range。
- Language。
- Scenario。
- Version Tag。
- Owner。
- Status：Draft / Published / Deprecated。
- Description。

使用方式：

- 顶部 Avatar 选择器读取 Avatar Name、Avatar ID 和 Version Tag。
- Tab 3、Tab 5、Tab 6 均依赖已发布 Avatar Profile。

### 6.4 形象资产 Edit Avatar

该区域参考当前 `Edit Avatar` 界面示意，主要用于管理 Avatar 在平台内的基础视觉资产。

字段：

- Head Image URL。
- Head Preview。
- Head Image Size。
- Card Image URL。
- Card Preview。
- Card Image Size。
- 图片加载状态。
- 图片 URL 合法性。
- 图片更新记录。

交互要求：

- 输入图片 URL 后自动拉取预览。
- 展示图片尺寸。
- 图片加载失败时展示错误提示。
- 保存前校验 URL 格式和图片可访问性。
- 图片变更进入 Avatar Profile 版本 Diff。

说明：

- Head Image 用于头像、角色选择器、调试识别。
- Card Image 用于 Avatar 卡片、列表展示和素材预览。
- 形象资产只描述平台内展示素材，不直接替代 Default Appearance Prompt。

### 6.5 默认外观 Default Appearance

默认外观用于描述数字人在未试衣、未换装、未进入特殊外观状态时的稳定视觉状态。

字段：

- Visual Description：人物描述，不含背景。
- Hair。
- Makeup。
- Outfit。
- Shoes。
- Accessories。
- Default Pose。
- Default Camera Framing。
- Immutable Appearance Rules。

示例：

```text
A young East Asian woman with long black side-parted hair, natural makeup,
wearing a stylish dark-brown dress with red polka dots, black ankle boots,
and a slim silver wristband, standing relaxed with confident body language.
```

关键规则：

- 未经试衣或明确用户指令，不得自动更换服饰。
- 不得凭空新增鞋子、裤子、配饰。
- 场景变化不等于 Avatar 外观变化。
- 如果用户要求切换场景，应优先保持 Default Appearance。

### 6.6 Persona 人设

Persona 定义 Avatar 的角色灵魂和对话人格。

字段：

- Role Definition。
- Default Temperament。
- Personality Sliders。
- Topics。
- Speech Style。
- Knowledge Boundary。
- Forbidden Claims。

示例：

```text
You are Serena, a stylish and approachable live-stream host who helps viewers
explore outfits and share light moments.
```

Default Temperament 示例：

- Calm but focused。
- Observant rather than noisy。
- Concise in speech。
- Careful with unsupported claims。

### 6.7 可聊主题 Topics

用于约束 Avatar 能自然展开的话题范围。

示例：

- Fashion and outfit styling。
- Product design and fabric details。
- Simple lifestyle tips。
- Light daily conversation。

配置要求：

- 支持多标签录入。
- 支持自由文本补充。
- 支持在沙箱中查看 Topic 是否被命中。

### 6.8 语言风格 Speech Style

用于定义 Avatar 的表达方式。

字段：

- Style Rules。
- Good Examples。
- Bad Examples。
- Tone Keywords。
- Forbidden Expressions。

示例：

```text
Good:
"The drape of this fabric gives it a very clean silhouette."

Bad:
"This is the absolute best, most amazing thing you will ever find."
```

配置要求：

- Good / Bad 示例可成对维护。
- 发布前校验是否至少存在一个正向示例。
- 可在沙箱中作为风格约束注入 Prompt。

### 6.9 话术库 Script Library

用于沉淀 Avatar 自带的基础话术片段，服务于该 Avatar 的稳定表达风格。

Tab 2 Script Library 的定位：

- 属于 Avatar Profile 的一部分。
- 适用于所有状态，包括用户交互时的被动回答、沙箱测试和状态节点 Prompt 参考。
- 不强制绑定 Trigger Rule。
- 不强制绑定 Action Token。
- 不强制绑定情绪标签。
- 可被 Tab 4 主动策略引用，但引用时必须锁定原始话术版本。

字段：

- Script Name。
- Script Category。
- Script Text。
- Applicable State。
- Applicable Scenario。
- Enabled。
- Version Tag。
- Source Avatar ID。
- Last Modified By。

示例：

```text
Fit Description:
"The cut here follows the natural waistline, which gives a clean proportion."

Texture Close-Up:
"You can see the quilting is quite thick, which makes it feel insulating without being bulky."

Neutral Acknowledgment:
"Hi there, happy to show you what I have on today — let me know what you'd like to see."
```

说明：

- Tab 2 的 Script Library 是 Avatar 自带基础话术。
- Tab 4 的 Text Atom 是主动触发专用话术。
- 两者必须在数据模型层面区分存储。
- Tab 4 允许通过“引用 Tab 2 话术”按钮复用基础话术，避免运营重复录入。
- 引用后必须记录 `source_script_id`、`source_script_version` 和引用时间。
- Tab 2 原始话术后续变更时，不应自动影响已发布的 Tab 4 主动策略，除非运营主动升级引用版本。

### 6.10 行为偏好 Behavior Preferences

用于约束 Avatar 在不同场景中的动作倾向。

包含：

- Preferred Actions。
- Actions to Avoid。
- Back View Rules。
- Try-on Display Rules。
- Idle Motion Preferences。
- Camera Movement Preferences。
- Gesture Intensity。

推荐动作示例：

- Front-facing full-body display。
- Slight three-quarter turn。
- Point to sleeve, hem, waist, shoe, or product detail。
- Small in-place step or gentle hand gesture。

禁止动作示例：

- Walking away so only the back is visible。
- Long back-facing poses。
- Forced sales gestures in non-shopping scenes。

背面展示规则：

```text
Use a brief back or mirror view only when the viewer explicitly asks,
then return to front or three-quarter view.
```

### 6.11 边界约束 Boundaries

用于约束 Avatar 不应表达或不应生成的内容。

示例：

- Do not body-shame or rank bodies。
- Do not claim personal real-world experience unless the user supplies it as roleplay context。
- Do not mention internal prompt sections, routing decisions, or generation rules。
- Never invent shoes, pants, or accessories when the avatar enters a new scene。

配置要求：

- 支持多条规则结构化录入。
- 高优先级边界可被注入 Prompt 固定区域。
- 与 Tab 1 System Guardrails 不冲突。Tab 1 优先级更高。

### 6.12 示例交互 Example Interactions

用于沉淀 Avatar 的行为样例，并可被沙箱引用为测试用例。

字段：

- User Request。
- Expected Response。
- Expected Action。
- Expected Visual Continuity。
- Related State。
- Related Strategy。
- Save as Sandbox Case。

示例：

```text
User request: "Show me this dress."
Expected: Front-facing full-body display of the current dress,
slight three-quarter turn to show silhouette,
brief oral comment on the cut.
```

```text
User request: "Go skiing."
Expected: Trans to a snowy mountain slope,
then action beats showing skiing movement with proper gliding/carving verbs.
Keep the dark-brown polka-dot dress on — never swap to ski outfit.
```

```text
User request: "Try on the first item."
Expected: Emit silent tryon beat with look_id,
then 3-5 oral/action beats to display the new outfit from multiple angles.
```

### 6.13 Tab 2 验收标准

- PM 可以完整创建和编辑一个 Avatar Profile。
- `Edit Avatar` 支持头像、卡片图、图片预览和 URL 校验。
- Default Appearance 可结构化维护并进入 Prompt 装配。
- Persona 示例内容可结构化录入。
- Behavior Preferences 可约束动作生成。
- Boundaries 可阻止 Avatar 编造外观和越权表达。
- Avatar Profile 支持版本化、Diff、发布和回滚。
- Tab 3 和 Tab 5 能读取已发布 Avatar Profile。

---

## 7. Tab 3：状态编排

### 7.1 模块定位

状态编排是工作台核心主视图，通过 DAG 画布替代后端硬编码状态分支。

状态机负责定义：

- 当前 Avatar 处于什么状态。
- 遇到什么事件后流转到哪个状态。
- 每个状态绑定哪些业务策略包。
- 每个状态如何生成 Dynamic Context。
- 用户打断时如何平滑衔接上一轮动作。

### 7.2 状态节点

节点类型：

- 静默待机。
- 主动活跃。
- 用户交互。
- 商品讲解。
- 试衣展示。
- 异常兜底。
- 自定义业务状态。

自定义业务状态用于承载业务快速扩展场景，例如商品对比、售后答疑、尺码推荐、优惠解释、搭配建议等。

自定义状态规则：

- PM 可在 UI 中通过“+ 新建状态类型”创建自定义状态类型。
- 自定义状态类型名称在同一状态机版本内必须唯一。
- 自定义状态可独立绑定业务策略包。
- 自定义状态可独立配置 Dynamic Context 模板。
- 自定义状态可独立配置进入条件、退出条件和超时规则。
- 自定义状态可被主动策略引用。
- 发布后，自定义状态类型名称不允许直接覆盖，只能通过新版本变更。

UI 入口：

- 在状态机画布节点面板中提供“+ 新建状态类型”。
- 创建时需填写状态类型名称、业务说明、默认 Dynamic Context 模板。
- 创建后该类型进入当前 Avatar / 当前状态机版本的节点类型列表。
- 若该状态类型被节点引用，删除前必须先解除所有引用。

节点属性：

- 节点名称。
- 节点类型。
- 默认描述。
- 绑定业务策略包。
- 绑定主动策略。
- 默认待机动作。
- 是否启用状态打断缓冲锁。
- Dynamic Context 模板。
- 优先级。
- 发布状态。
- 是否为起始节点 `initial: true`。
- 是否为终止节点 `terminal: true`。

### 7.3 连线规则

连线用于描述状态流转。

连线属性：

- 起始状态。
- 目标状态。
- 触发事件。
- 条件表达式。
- 超时时间。
- 是否允许用户打断。
- 冲突处理策略。
- 优先级。

示例：

```text
当前状态：用户交互
事件：ASR 无输入超时 15s
目标状态：静默待机
动作：进入循环待机动作
```

### 7.4 状态打断缓冲锁

当用户在静默、主动、展示等状态中突然插话，状态机需要读取上一轮 History Buffer 中的动作状态，并注入本轮 Dynamic Context。

目标：

- 避免动作突然中断。
- 避免面部闪烁。
- 让数字人自然完成上一动作并进入交互。
- 解决“一秒变僵尸”的状态跳变问题。

示例流程：

```text
静默待机动作：眼神微动 + 均匀呼吸
用户突然插话："这件衣服多少钱？"
装配引擎读取上一轮动作 Buffer
Dynamic Context 注入：请先自然收尾当前微表情，再进入价格讲解
```

### 7.5 画布联动业务策略

当 PM 在 Tab 3 中选中任意节点时，右侧属性面板展示“激活附加策略包”下拉框。

下拉框数据来源：

- Tab 1 组 B 中已启用的业务策略包。
- 当前 Avatar 可用的业务策略包。
- 当前环境可用的业务策略包。

勾选后，该策略包参与该节点运行时 Prompt 装配。

---

## 8. Prompt 三明治装配机制

### 8.1 装配公式

运行时 Final Prompt 使用固定顺序拼接：

```text
Final_Prompt =
System_Base
+ Avatar_Profile_Context
+ Persona_Context
+ Business_Strategy_Context
+ Dynamic_Context
```

### 8.2 装配原则

- System Base 永远居首。
- Avatar Profile 和 Persona 保持稳定位置。
- 业务策略按编译后的固定顺序拼接。
- 用户输入、主动话术、状态上下文、History Buffer 放在尾部。
- 后端运行时只做 Redis 读取和模板填充。
- 不允许在线上运行时执行复杂策略分支判断。
- 发布前完成 Jinja2 变量校验。

### 8.3 变量校验机制

Prompt 模板统一使用 Jinja2 风格变量占位符。

变量规范：

- 标准变量格式为 `{{ variable_name }}`。
- 变量命名统一使用小写蛇形命名，例如 `{{ user_name }}`、`{{ current_state }}`。
- 允许使用 Jinja2 默认值表达式，例如 `{{ user_name | default('用户') }}`。
- 不允许在模板中写复杂业务逻辑判断，复杂逻辑必须在编译前配置或后端上下文中完成。

变量来源范围：

- System Base。
- Avatar Profile。
- Persona。
- Business Strategy。
- State Node。
- Dynamic Context。
- History Buffer。
- Runtime Context。

发布前强制校验项：

- 所有变量必须能在当前上下文字段中找到对应来源。
- 未匹配变量必须阻断发布。
- 未匹配变量需要在 UI 中高亮定位到具体资产、字段和行号。
- 存在 fallback 的变量允许发布，但需要在校验结果中展示默认值来源。
- 同名变量若来自多个上下文，需要按照装配优先级解析，并在校验结果中展示最终命中来源。

校验失败示例：

```text
变量校验失败：
{{ product_price }} 未在当前状态节点、业务策略或 Runtime Context 中找到。
请补充字段映射或设置 fallback 值，例如 {{ product_price | default('暂无价格') }}。
```

### 8.4 KV Cache 友好约束

为提升首 Token 延迟表现，Prompt 拼接顺序必须稳定。

固定区域：

- System Base。
- Avatar Profile。
- Persona。
- 已启用业务策略。

动态区域：

- 用户输入。
- 主动话术。
- 当前状态。
- History Buffer。
- 实时商品上下文。

### 8.5 性能目标

- 单次 Prompt 组装与模板渲染耗时 <= 5ms。
- 该指标仅包含纯 CPU 拼接和 Jinja2 渲染。
- 该指标不包含 Redis 读取、网络 I/O、数据库查询和下游模型响应耗时。
- 静态资产必须使用 Redis 强缓存。
- 状态机配置发布时预编译。
- 后端运行时不解析复杂图结构，只读取编译后的运行时配置。

---

## 9. Tab 4：主动策略

### 9.1 模块定位

主动策略用于管理数字人在非用户直接输入场景下的主动表达。

策略从“定时触发一句话”升级为三元组：

```text
Trigger Rule + Text Atom + Action Token
```

### 9.2 配置项

每条主动策略包含：

- 策略名称。
- 触发规则。
- 适用状态。
- 话术原子。
- 动作 Token。
- 情绪标签。
- 优先级。
- 冷却时间。
- 生效时间段。
- 启用状态。

### 9.3 语义防错锁

系统需要校验文本情绪与动作信号是否冲突。

冲突示例：

- 文本为道歉、悲伤、故障解释。
- 动作却选择大笑、剧烈摆手、兴奋跳动。

冲突处理：

- 行内标红。
- 关联状态节点展示警告。
- 阻断保存。
- 弹窗提示冲突原因。

提示示例：

```text
[语义冲突警告]
话术情感与动作信号冲突，请重新校对。
```

### 9.4 与 Tab 2 话术库的关系

Tab 2 Script Library 与 Tab 4 Text Atom 必须区分资产边界。

| 对比项 | Tab 2 Script Library | Tab 4 Text Atom |
| --- | --- | --- |
| 资产归属 | Avatar Profile | 主动策略引擎 |
| 使用场景 | Avatar 基础表达、被动回答、示例沉淀 | 主动触发话术 |
| 是否必须绑定 Trigger Rule | 否 | 是 |
| 是否必须绑定 Action Token | 否 | 是 |
| 是否必须绑定情绪标签 | 否 | 是 |
| 是否可被复用 | 可被 Tab 4 引用 | 可被多个主动策略引用 |
| 版本策略 | 跟随 Avatar Profile 版本 | 跟随主动策略版本 |

Tab 4 交互要求：

- 在 Text Atom 编辑区提供“引用 Tab 2 话术”按钮。
- 点击后弹出 Avatar Script Library 选择器。
- 选择时展示话术内容、Avatar ID、话术版本和最近修改时间。
- 确认引用后，在 Tab 4 中生成一条 Text Atom 引用记录。
- 引用记录必须锁定 `source_script_id` 和 `source_script_version`。
- 原始 Tab 2 话术后续更新时，Tab 4 显示“可升级引用版本”提示，但不自动变更已发布策略。

---

## 10. Tab 5：沙箱模拟

### 10.1 模块定位

沙箱用于在上线前验证最终 Prompt、策略命中、动作约束和行为结果。

### 10.2 核心能力

- 选择 Avatar。
- 选择 Avatar Profile 版本。
- 选择环境。
- 选择状态节点。
- 输入用户 Query。
- 勾选业务策略包。
- 展开 Full Prompt。
- 查看分层 Prompt。
- 查看 Token 统计。
- 查看热力图。
- 一键复制。
- 保存为测试样例。

### 10.3 Full Prompt 分层展示

展示区域按装配层级分块：

- System Base。
- Avatar Profile。
- Persona。
- Business Strategy。
- Dynamic Context。
- History Buffer。
- Final Full Prompt。

每一层展示：

- 来源资产。
- 版本号。
- Token 数。
- 是否命中。
- 是否存在校验警告。

### 10.4 热力图预警

系统根据 Prompt 位置和长度进行可视化提示。

规则：

- 越靠后的 Prompt 区域颜色越深，代表近期注意力更强。
- 若 Persona 或关键边界规则被挤压到低权重区域，提示风险。
- 若 Dynamic Context 过长，提示压缩。
- 支持“尾部二次强调”开关进行验证。

尾部二次强调定义：

- 当 Persona、Boundaries、Guardrails 或关键业务约束被动态输入挤压到低权重区域时，系统可将关键约束摘要复制一份追加到 Prompt 尾部。
- 该能力用于提升关键约束在模型生成前的可见性。
- 默认关闭，仅在沙箱中用于验证效果。
- 若上线启用，必须在运行时配置中显式开启 `enable_tail_reinforcement`。

沙箱交互：

- 在热力图面板中提供“启用尾部二次强调”开关。
- 开启后重新渲染 Full Prompt，并标记尾部新增的 Reinforcement 区块。
- 对比开启前后的 Token 数、关键约束位置和预估风险。
- 该开关默认不改变线上已发布配置，除非在发布配置中显式保存。

预警示例：

```text
Persona 关键约束位于低权重区域，可能被动态输入稀释。
建议缩短 Dynamic Context 或开启尾部二次强调。
```

---

## 11. Tab 6：线上追溯

### 11.1 模块定位

线上追溯用于还原历史真实 Prompt 拼接现场。

### 11.2 查询能力

支持按以下条件检索：

- Session ID。
- Turn ID。
- Avatar ID。
- User ID。
- 时间范围。
- 环境。
- 版本号。
- 状态节点。
- 策略包。

### 11.3 快照内容

每条 Turn 快照包含：

- Full Prompt 原文。
- System Base 版本。
- Avatar Profile 版本。
- Persona 版本。
- 业务策略包版本。
- 状态机版本。
- Dynamic Context。
- History Buffer。
- 用户输入。
- 模型输出。
- 动作 Token。
- Prompt 组装耗时。
- 下游模型响应耗时。
- 错误信息。

### 11.4 存储要求

- 使用 ClickHouse 或 Elasticsearch。
- 存储真实全量 Snapshot。
- 至少保留 30 天。
- 只读不可编辑。
- 支持事故 100% 还原。

### 11.5 脱敏展示与审计

线上追溯涉及用户输入、用户标识和完整 Prompt，需按角色做分级展示。

脱敏规则：

- User ID 默认展示前 4 位 + `****`，例如 `user****`。
- 用户输入文本超过 20 字时默认折叠，仅展示前 20 字摘要。
- Full Prompt 中若包含用户隐私字段，PM 和运营默认看到脱敏版本。
- Session ID、Turn ID 可完整展示，用于排障定位。

权限区分：

- 算法 / 后端工程师可查看完整 User ID、完整用户输入和完整 Full Prompt。
- PM 可查看脱敏 User ID、折叠后的用户输入和脱敏 Full Prompt。
- 运营可查看脱敏 User ID、折叠后的用户输入和主动策略命中结果。
- 若 PM 或运营需要查看完整快照，必须通过临时授权或审批流程。

审计要求：

- 查看完整快照必须记录审计日志。
- 审计日志需记录查看人、查看时间、Session ID、Turn ID、查看字段范围和授权来源。
- 审计日志不可被普通用户删除或编辑。
- 高频查看完整快照应触发安全提醒。

---

## 12. 数据实体设计

### 12.1 核心实体

- Avatar。
- Avatar Profile。
- Avatar Image Asset。
- Persona Version。
- Avatar Script Library。
- System Base。
- Biz Strategy Package。
- State Machine Graph。
- State Node。
- State Edge。
- Proactive Trigger Rule。
- Proactive Text Atom。
- Action Token。
- Sandbox Render Result。
- Prompt Snapshot。
- Publish Ticket。
- Audit Log。

### 12.2 存储建议

| 实体 | 存储方式 | 说明 |
| --- | --- | --- |
| System Base | MySQL Text + Redis | 已发布版本强缓存 |
| Biz Strategy | MySQL 结构化字段 + Redis | 支持多字段扩展 |
| Avatar Profile | MySQL 结构化字段 | 按 Avatar ID + Version Tag 管理 |
| Persona | 独立版本表 | 支持 Diff 与回滚 |
| Avatar Script Library | 独立话术表 | Avatar 基础话术，不强制绑定触发规则 |
| State Machine Graph | JSON | 发布时编译为运行时配置 |
| Proactive Text Atom | 独立话术表 | 主动触发话术，支持引用 Avatar Script Library 版本 |
| Proactive Strategy | 多对多关系表 | Trigger、Proactive Text Atom、Action Token 关联 |
| Sandbox Result | 默认不持久化 | 可选择保存为测试样例 |
| Prompt Snapshot | ClickHouse / Elasticsearch | 线上全量快照 |

### 12.3 话术引用关系

Tab 4 引用 Tab 2 话术时，不复制为不可追踪的普通文本，而是创建带版本锁定的引用关系。

建议字段：

- `proactive_text_atom_id`。
- `text_atom_content`。
- `source_type`：`manual` 或 `avatar_script_library`。
- `source_script_id`。
- `source_script_version`。
- `source_avatar_id`。
- `reference_locked_at`。
- `reference_locked_by`。

约束：

- `source_type = avatar_script_library` 时，必须存在 `source_script_id` 和 `source_script_version`。
- 原始话术升级后，引用方不自动升级。
- 删除被引用的 Tab 2 话术时，应提示存在引用关系，不允许直接物理删除。

---

## 13. 发布流程

标准发布链路：

1. 编辑资产或策略。
2. 保存草稿。
3. 自动变量校验。
4. 语义冲突校验。
5. 状态机拓扑校验。
6. 沙箱模拟。
7. 编译运行时配置。
8. 发起发布工单。
9. 审批通过后发布 Staging。
10. 验证通过后发布 Production。
11. 线上开始沉积新版本 Snapshot。

发布前必须校验：

- Prompt 变量完整。
- 状态机无环。
- 节点无孤岛。
- 策略包引用有效。
- Avatar Profile 已发布。
- System Base 已发布。
- Prompt 长度不超过阈值。
- 动作 Token 合法。
- 权限符合 RBAC 要求。

### 13.1 状态机拓扑校验细则

状态机发布前必须完成拓扑校验。

无环校验：

- 状态流转图不允许存在循环依赖，例如 `A -> B -> A`。
- 若业务确实需要循环行为，应使用显式的循环待机节点和超时退出条件，而不是隐式环路。
- 检测到环路时，UI 需要高亮涉及的节点和连线。

无孤岛校验：

- 不允许存在没有任何连入和连出的孤立节点。
- 起始节点允许没有连入。
- 终止节点允许没有连出。
- 其他节点至少需要一条有效连入或连出关系。

起始状态校验：

- 每个状态机版本至少需要一个节点标记为 `initial: true`。
- 若存在多个起始节点，必须配置起始条件优先级。
- 起始节点必须可达至少一个非起始节点，避免启动后停留在无效状态。

终止状态校验：

- 每个状态机版本至少需要一个节点标记为 `terminal: true`。
- 异常兜底节点建议默认标记为终止状态之一。
- 终止节点若配置出边，必须显式声明允许恢复或重试。

引用有效性校验：

- 节点绑定的业务策略包 ID 必须存在且处于可用状态。
- 节点绑定的主动策略 ID 必须存在且处于可用状态。
- 节点引用的 Persona ID / Avatar Profile ID 必须存在且已发布。
- 状态机引用的 System Base ID 必须存在且已发布。
- 连线引用的事件类型必须存在于事件字典中。
- Dynamic Context 模板中的变量必须通过变量校验。

---

## 14. 非功能性需求

### 14.1 性能

- Prompt 组装与模板渲染耗时 <= 5ms。
- 5ms 仅包含纯 CPU 拼接和 Jinja2 渲染耗时。
- 5ms 不包含 Redis 读取网络往返时间、数据库查询、日志写入、下游模型请求或其他 I/O。
- Redis 读取、网络 I/O 和下游模型耗时需要单独埋点统计。
- 静态资产必须支持 Redis 强缓存。
- 发布后的编排配置必须预编译。
- 运行时不允许解析原始画布拓扑。
- 拼接顺序必须稳定，保障 KV Cache 命中。

### 14.2 可追溯

- 所有发布操作必须生成审计日志。
- 所有线上 Turn 必须记录真实 Full Prompt Snapshot。
- Snapshot 不可编辑、不可覆盖。
- 支持按版本回溯当时生效配置。

### 14.3 安全与权限

- System Core 仅算法 / 后端可编辑。
- 业务策略、Avatar Profile、Persona、状态编排由 PM 维护。
- 主动话术由运营维护。
- 生产发布必须经过审批。
- 线上追溯只读。

### 14.4 可用性

- 编辑页必须支持保存草稿。
- 发布前必须展示 Diff。
- 表单变更未保存时切换页面需二次确认。
- 图片 URL 加载失败时必须明确提示。
- Prompt 校验失败时必须定位到具体字段。

---

## 15. MVP 范围

### 15.1 首版范围

首版建议包含：

- Tab 1：System Base + 业务策略包。
- Tab 2：Avatar Profile + Edit Avatar + Persona。
- Tab 3：React Flow 状态机画布。
- Tab 5：Full Prompt 展开预览。
- 基础 RBAC。
- 草稿 / 发布版本。
- Redis 缓存。
- 固定顺序 Prompt 拼接。

### 15.2 二期增强

二期增强：

- Tab 4 主动策略完整语义防错锁。
- Tab 6 线上追溯。
- 热力图权重预警。
- 尾部二次强调线上配置化。
- History Buffer 动作收尾。
- 审批流。
- Prompt Diff 与回滚。
- 自动化回归测试集。

尾部二次强调预留：

- 运行时配置预留 `enable_tail_reinforcement` 字段，默认 `false`。
- 预留 `tail_reinforcement_fields` 字段，用于声明可被尾部强调的约束来源。
- Tab 5 沙箱先提供验证开关，生产发布默认不启用。
- 若二期启用生产能力，发布前必须展示启用后的 Full Prompt Diff 和新增 Token 数。

---

## 16. 核心验收标准

- PM 可以在 Tab 2 完整创建和编辑一个 Avatar Profile。
- `Edit Avatar` 支持头像、卡片图、图片预览和 URL 校验。
- Default Appearance 可结构化维护并进入 Prompt 装配。
- Persona 示例内容可结构化录入。
- Behavior Preferences 可约束动作生成。
- Boundaries 可阻止 Avatar 编造外观和越权表达。
- Avatar Profile 支持版本化、Diff、发布和回滚。
- PM 可以在不改代码的情况下新增业务策略包。
- Tab 3 可以将业务策略绑定到状态节点。
- 状态机发布前能校验无环、无孤岛、引用有效。
- 后端运行时不依赖业务 `if-else` 拼接 Prompt。
- 沙箱可以展开最终 Full Prompt。
- Prompt 组装耗时 <= 5ms。
- 线上任意 Turn 可以还原真实 Prompt Snapshot。
- 不同角色只能编辑自己权限范围内的模块。

