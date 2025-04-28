# NoteFlow - Visual Style Guide

## Color Palette

### 1. Primary Colors
- **Primary Blue**: #3b82f6
  - Used for: Main actions, links, highlights
  - Hover: #2563eb
  - Active: #1d4ed8

### 2. Secondary Colors
- **Success Green**: #10b981
  - Used for: Success states, confirmations
- **Error Red**: #ef4444
  - Used for: Errors, warnings, deletions
- **Accent Purple**: #8b5cf6
  - Used for: Highlights, special features

### 3. Neutral Colors
- **Background**: #f8fafc
- **Surface**: #ffffff
- **Text Primary**: #1e293b
- **Text Secondary**: #64748b
- **Border**: #e2e8f0

## Typography

### 1. Font Family
- **Primary Font**: Inter
  - Used for: All text
  - Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### 2. Font Sizes
- **Headings**
  - H1: 2.25rem (36px)
  - H2: 1.875rem (30px)
  - H3: 1.5rem (24px)
  - H4: 1.25rem (20px)

- **Body Text**
  - Large: 1.125rem (18px)
  - Regular: 1rem (16px)
  - Small: 0.875rem (14px)
  - Tiny: 0.75rem (12px)

### 3. Line Heights
- Headings: 1.2
- Body: 1.6
- Tight: 1.4

## Spacing System

### 1. Base Unit
- 4px (0.25rem)

### 2. Spacing Scale
- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)

## Border Radius

### 1. Scale
- sm: 0.375rem (6px)
- md: 0.5rem (8px)
- lg: 0.75rem (12px)
- xl: 1rem (16px)
- full: 9999px

## Shadows

### 1. Elevation Levels
- sm: 0 1px 3px rgba(0, 0, 0, 0.05)
- md: 0 4px 6px -1px rgba(0, 0, 0, 0.08)
- lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08)
- xl: 0 20px 25px -5px rgba(0, 0, 0, 0.08)

## Icons

### 1. Icon System
- Font Awesome 5
- Size: 1.25rem (20px)
- Color: Inherit from text

### 2. Icon Usage
- Navigation: 1.25rem
- Actions: 1rem
- Decorative: 1.5rem

## Components

### 1. Buttons
- **Primary**
  - Background: Primary Blue
  - Text: White
  - Hover: Darker Blue
  - Active: Darkest Blue

- **Secondary**
  - Background: White
  - Border: Border Color
  - Text: Text Primary
  - Hover: Background Color

### 2. Inputs
- Height: 2.5rem
- Padding: 0.75rem
- Border: 1px solid Border Color
- Focus: 2px solid Primary Blue

### 3. Cards
- Background: White
- Border: 1px solid Border Color
- Border Radius: md
- Shadow: sm
- Hover: Shadow md

## States

### 1. Interactive States
- **Hover**
  - Scale: 1.02
  - Shadow: Increase one level
  - Transition: 0.2s ease

- **Active**
  - Scale: 0.98
  - Shadow: Decrease one level

- **Focus**
  - Outline: 2px solid Primary Blue
  - Outline Offset: 2px

### 2. Loading States
- **Skeleton**
  - Background: Linear gradient
  - Animation: Shimmer

- **Spinner**
  - Color: Primary Blue
  - Size: 1.5rem
  - Animation: Rotate

## Animations

### 1. Transitions
- Duration: 0.2s - 0.3s
- Timing: ease-out
- Properties: all

### 2. Keyframes
- Fade In
- Slide Up
- Scale In
- Rotate
- Pulse
- Shake 