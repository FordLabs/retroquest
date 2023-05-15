# New Domain Model

## Outline
* User
* Team
* Retro
* Retro Type
* Topic
* Thought
* Action Item
* Retro Type?

## User
Represents a user of the RetroQuest application
Generated when a user signs up using their preferred flavor of OAuth the first time.

### Contains
* OAuth ID
* OAuth provider
* Username?
* Email address?
* List of teams user is associated with

## Team
Represents a team that conducts retros.

### Contains
* ID
* Name
* List of Retros conducted
* List of Action Items
* List of users on team

## Retro
Represents an individual retrospective.

### Contains
* ID
* Facilitator? - defaults to User making the retro
* List of Thoughts
* Retro Type

## Retro Type
Represents the types of retros that can be had.
Holds rules for upvote counts, topics, etc.
Should be able to be read in through config file at app startup

### Contains
* List of Topics

## Topic
Represents one of the columns in a retrospective.

### Contains
* ID
* Display name
* Description

## Thought
Represents a card that a user submits during a retro.

### Contains
* ID
* Text
* Vote count
* Completion status
* Associated Topic

## Action Item
Represents a task or action to come out of a retro.

### Contains
* ID
* Text
* Assignee (User or string?)
* Completion status
