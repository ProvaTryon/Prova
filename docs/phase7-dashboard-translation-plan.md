# Phase 7: Dashboard Translation Plan

## 🎯 Objective
Translate all admin, store-owner, and customer-service dashboards that were missed in Phases 1-6.

---

## 📋 Discovery & Assessment

### Dashboard Sections Found:

#### 1. **Admin Dashboard** (`/[locale]/admin`)
**Files:**
- ✅ `app/[locale]/admin/layout.tsx` - Already in [locale]
- ❌ `app/[locale]/admin/page.tsx` - Main dashboard (NOT translated)
- ❌ `components/admin/admin-sidebar.tsx` - Sidebar navigation (NOT translated)
- ❌ Sub-pages: orders/, products/, settings/, stores/, users/

**Content to Translate:**
- Dashboard title and stats
- Sidebar menu items (Dashboard, Stores, Products, Users, Orders, Settings)
- "Admin Panel", "Back to Store" button
- All sub-page content

---

#### 2. **Store Owner Dashboard** (`/[locale]/store-owner`)
**Files:**
- ✅ `app/[locale]/store-owner/layout.tsx` - Already in [locale]
- ❌ `app/[locale]/store-owner/page.tsx` - Main dashboard (NOT translated)
- ❌ `components/store-owner/store-sidebar.tsx` - Sidebar navigation (NOT translated)
- ❌ Sub-pages: analytics/, products/, settings/

**Content to Translate:**
- Dashboard title and welcome message
- Stats labels (Total Products, Total Sales, Revenue, Conversion Rate)
- Sidebar menu items (Dashboard, My Products, Analytics, Settings)
- "Store Owner", "View Store" button
- All sub-page content

---

#### 3. **Customer Service Dashboard** (`/[locale]/customer-service`)
**Files:**
- ✅ `app/[locale]/customer-service/layout.tsx` - Already in [locale]
- ❌ `app/[locale]/customer-service/page.tsx` - Main dashboard (NOT translated)
- ❌ `components/customer-service/cs-sidebar.tsx` - Sidebar navigation (NOT translated)
- ❌ Sub-pages: analytics/, conversations/, settings/

**Content to Translate:**
- Dashboard title and stats
- Stats labels (Waiting, Active, Resolved Today, Unread Messages)
- Sidebar menu items (Dashboard, Conversations, Analytics, Settings)
- "Customer Service", "Support Dashboard", "View Store" button
- All sub-page content

---

## 🏗️ Implementation Strategy

### Approach 1: Client-Side useTranslations (Recommended) ✅
**Pros:**
- All dashboard pages are "use client" already
- Easy to implement with existing next-intl setup
- No routing changes needed
- Sidebar components can use useTranslations directly

**Cons:**
- None significant

**Implementation:**
1. Import `useTranslations` in each component
2. Add translation keys to `messages/en.json` and `messages/ar.json`
3. Replace hardcoded strings with `t('key')`
4. Add RTL-aware classes where needed

---

### Approach 2: Server Components with getTranslations ❌
**Pros:**
- Better for SEO

**Cons:**
- All dashboard pages are already "use client"
- Would require major refactoring
- Not worth the effort for authenticated dashboards

---

## ✅ Recommended Approach: **Client-Side useTranslations**

---

## 📝 Translation Keys Structure

### New Namespace: `admin`
```json
{
  "admin": {
    "title": "Admin Panel",
    "dashboard": {
      "title": "Dashboard",
      "welcome": "Welcome to the Pròva admin panel",
      "stats": {
        "totalStores": "Total Stores",
        "activeStores": "active",
        "totalProducts": "Total Products",
        "totalUsers": "Total Users",
        "revenue": "Revenue"
      }
    },
    "sidebar": {
      "dashboard": "Dashboard",
      "stores": "Stores",
      "products": "Products",
      "users": "Users",
      "orders": "Orders",
      "settings": "Settings",
      "backToStore": "Back to Store"
    }
  }
}
```

### New Namespace: `storeOwner`
```json
{
  "storeOwner": {
    "title": "Store Owner",
    "subtitle": "Manage your store",
    "dashboard": {
      "welcome": "Welcome back, {name}",
      "subtitle": "Here's what's happening with {storeName} today",
      "stats": {
        "totalProducts": "Total Products",
        "totalSales": "Total Sales",
        "revenue": "Revenue",
        "conversionRate": "Conversion Rate",
        "thisMonth": "this month",
        "fromLastMonth": "from last month"
      }
    },
    "sidebar": {
      "dashboard": "Dashboard",
      "myProducts": "My Products",
      "analytics": "Analytics",
      "settings": "Settings",
      "viewStore": "View Store"
    }
  }
}
```

### New Namespace: `customerService`
```json
{
  "customerService": {
    "title": "Customer Service",
    "subtitle": "Support Dashboard",
    "dashboard": {
      "title": "Customer Service Dashboard",
      "subtitle": "Manage customer inquiries and support tickets",
      "stats": {
        "waiting": "Waiting",
        "active": "Active",
        "resolvedToday": "Resolved Today",
        "unreadMessages": "Unread Messages"
      },
      "recentConversations": "Recent Conversations",
      "viewAll": "View All Conversations"
    },
    "sidebar": {
      "dashboard": "Dashboard",
      "conversations": "Conversations",
      "analytics": "Analytics",
      "settings": "Settings",
      "viewStore": "View Store"
    }
  }
}
```

---

## 🔧 Implementation Steps

### Step 1: Add Translation Keys
**Files to Update:**
- `frontend/messages/en.json` - Add admin, storeOwner, customerService namespaces
- `frontend/messages/ar.json` - Add Arabic translations

**Estimated Keys:** ~60 new translation keys

---

### Step 2: Update Admin Components

#### 2.1 Admin Sidebar (`components/admin/admin-sidebar.tsx`)
```tsx
"use client"

import { useTranslations } from 'next-intl'
// ... existing imports

export function AdminSidebar() {
  const t = useTranslations('admin.sidebar')
  const pathname = usePathname()
  
  const navItems = [
    { name: t('dashboard'), href: "/admin", icon: LayoutDashboard },
    { name: t('stores'), href: "/admin/stores", icon: Store },
    { name: t('products'), href: "/admin/products", icon: Package },
    { name: t('users'), href: "/admin/users", icon: Users },
    { name: t('orders'), href: "/admin/orders", icon: ShoppingCart },
    { name: t('settings'), href: "/admin/settings", icon: Settings },
  ]

  return (
    <aside className="...">
      <div className="p-6">
        <h2>{t('title')}</h2>
        <Link href="/">
          <Home className="..." />
          <span>{t('backToStore')}</span>
        </Link>
        {/* ... rest */}
      </div>
    </aside>
  )
}
```

#### 2.2 Admin Dashboard Page (`app/[locale]/admin/page.tsx`)
```tsx
"use client"

import { useTranslations } from 'next-intl'
// ... existing imports

export default function AdminDashboard() {
  const t = useTranslations('admin.dashboard')
  const tStats = useTranslations('admin.dashboard.stats')
  
  const stats = [
    {
      name: tStats('totalStores'),
      value: totalStores.toString(),
      change: `${activeStores} ${tStats('activeStores')}`,
      // ...
    },
    {
      name: tStats('totalProducts'),
      // ...
    },
    // ... rest
  ]

  return (
    <div>
      <div className="mb-8">
        <h1>{t('title')}</h1>
        <p>{t('welcome')}</p>
      </div>
      {/* ... rest */}
    </div>
  )
}
```

---

### Step 3: Update Store Owner Components

#### 3.1 Store Sidebar (`components/store-owner/store-sidebar.tsx`)
- Import useTranslations
- Translate sidebar title, subtitle, links
- Update "View Store" button

#### 3.2 Store Owner Dashboard Page (`app/[locale]/store-owner/page.tsx`)
- Translate welcome message (with user name interpolation)
- Translate stats labels
- Translate change descriptions

---

### Step 4: Update Customer Service Components

#### 4.1 CS Sidebar (`components/customer-service/cs-sidebar.tsx`)
- Import useTranslations
- Translate sidebar title, subtitle, links
- Update "View Store" button

#### 4.2 CS Dashboard Page (`app/[locale]/customer-service/page.tsx`)
- Translate dashboard title and subtitle
- Translate stats labels
- Translate "Recent Conversations" section

---

### Step 5: Update Sub-Pages (If Needed)
**Note:** Many sub-pages may be empty or minimal. Prioritize based on actual content.

#### Admin Sub-pages:
- `admin/orders/page.tsx` - Order management
- `admin/products/page.tsx` - Product management
- `admin/settings/page.tsx` - Settings
- `admin/stores/page.tsx` - Store management
- `admin/users/page.tsx` - User management

#### Store Owner Sub-pages:
- `store-owner/analytics/page.tsx` - Analytics dashboard
- `store-owner/products/page.tsx` - Product management
- `store-owner/settings/page.tsx` - Settings

#### Customer Service Sub-pages:
- `customer-service/analytics/page.tsx` - Analytics
- `customer-service/conversations/page.tsx` - Conversation list
- `customer-service/settings/page.tsx` - Settings

---

### Step 6: Add RTL Support
**Key Considerations:**
- Sidebar positioning (should flip from left to right in RTL)
- Dashboard stats grid (should flow RTL)
- Table layouts (if any)
- Icon directions (arrows, chevrons)

**CSS Updates Needed:**
- Add RTL-aware sidebar positioning in `globals.css`
- Update flex/grid directions for RTL
- Ensure proper spacing and padding

---

## 📊 Estimated Workload

| Task | Estimated Time | Complexity |
|------|----------------|------------|
| Add translation keys (60+ keys) | 30 min | Low |
| Update Admin Sidebar | 10 min | Low |
| Update Admin Dashboard | 15 min | Low |
| Update Store Owner Sidebar | 10 min | Low |
| Update Store Owner Dashboard | 15 min | Medium |
| Update CS Sidebar | 10 min | Low |
| Update CS Dashboard | 15 min | Medium |
| Update Sub-pages (estimated 10 pages) | 60 min | Medium |
| RTL CSS adjustments | 20 min | Medium |
| Testing | 30 min | Low |
| **Total** | **~3.5 hours** | **Medium** |

---

## 🧪 Testing Checklist

### Admin Dashboard Testing
- [ ] Login as admin (admin@test.com / admin123)
- [ ] Verify dashboard displays in English
- [ ] Switch to Arabic - verify translations
- [ ] Verify RTL layout (sidebar, stats, tables)
- [ ] Test all sidebar navigation links
- [ ] Check all sub-pages (Orders, Products, Users, Stores, Settings)

### Store Owner Dashboard Testing
- [ ] Login as store owner (merchant@test.com / merchant123)
- [ ] Verify dashboard displays in English
- [ ] Switch to Arabic - verify translations
- [ ] Verify welcome message with user name
- [ ] Verify stats display correctly
- [ ] Test all sidebar navigation links
- [ ] Check all sub-pages (Products, Analytics, Settings)

### Customer Service Dashboard Testing
- [ ] Login as customer service (cs@test.com / cs123)
- [ ] Verify dashboard displays in English
- [ ] Switch to Arabic - verify translations
- [ ] Verify stats display correctly
- [ ] Test all sidebar navigation links
- [ ] Check all sub-pages (Conversations, Analytics, Settings)

### Cross-Dashboard Testing
- [ ] Test "Back to Store" / "View Store" buttons in all dashboards
- [ ] Verify language switching persists across dashboard navigation
- [ ] Test logout and login with different roles
- [ ] Verify responsive design on mobile/tablet

---

## 🚨 Critical Issues to Address

### 1. **Sidebar Links Missing Locale Prefix**
**Current:** `href="/admin"`, `href="/store-owner"`
**Problem:** These will navigate to routes outside [locale] folder
**Solution:** Use locale-aware routing

```tsx
import { useParams } from 'next/navigation'

export function AdminSidebar() {
  const params = useParams()
  const locale = params.locale as string
  
  const navItems = [
    { name: t('dashboard'), href: `/${locale}/admin`, icon: LayoutDashboard },
    { name: t('stores'), href: `/${locale}/admin/stores`, icon: Store },
    // ... etc
  ]
}
```

### 2. **"Back to Store" Button Missing Locale**
**Current:** `href="/"`
**Solution:** `href={\`/\${locale}\`}`

---

## ✅ Success Criteria

1. All dashboard pages display correctly in both English and Arabic
2. All sidebar navigation items translated
3. RTL layout works properly (sidebar flips, content flows right-to-left)
4. User-specific content (names, store names) displays correctly with translations
5. Language switching works seamlessly within dashboards
6. All navigation links include locale prefix
7. No hardcoded English strings visible in Arabic mode
8. Stats, tables, and grids display properly in RTL
9. Icons and buttons position correctly in RTL
10. "Back to Store" / "View Store" buttons work in both languages

---

## 📦 Deliverables

1. ✅ Updated `messages/en.json` with 60+ new keys
2. ✅ Updated `messages/ar.json` with Arabic translations
3. ✅ Translated `admin-sidebar.tsx`
4. ✅ Translated `admin/page.tsx`
5. ✅ Translated `store-sidebar.tsx`
6. ✅ Translated `store-owner/page.tsx`
7. ✅ Translated `cs-sidebar.tsx`
8. ✅ Translated `customer-service/page.tsx`
9. ✅ Updated sub-pages (as needed)
10. ✅ RTL CSS adjustments for dashboards
11. ✅ Testing report
12. ✅ Documentation update

---

## 🔄 Next Steps

After Phase 7 completion:
1. Update Phase 6 testing report to mark dashboards as tested
2. Update project README with complete feature list
3. Create final completion report for entire Arabic localization project
4. Prepare for production deployment

---

**Phase 7 Status:** 📋 PLANNED - Ready to implement
**Dependencies:** Phase 6 testing complete ✅
**Priority:** HIGH - Critical for complete localization
