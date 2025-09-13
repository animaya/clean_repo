import { PrismaClient, UserRole, TaskStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clean up existing data
  await prisma.comment.deleteMany()
  await prisma.task.deleteMany()
  await prisma.session.deleteMany()
  await prisma.project.deleteMany()
  await prisma.user.deleteMany()

  console.log('🧹 Cleaned existing data')

  // Create Users (5 total: 1 PM, 4 engineers)
  const users = await prisma.user.createMany({
    data: [
      {
        name: 'Sarah Chen',
        role: UserRole.PRODUCT_MANAGER,
        email: 'sarah@taskify.com',
      },
      {
        name: 'Alex Rivera',
        role: UserRole.ENGINEER,
        email: 'alex@taskify.com',
      },
      {
        name: 'Jordan Kim',
        role: UserRole.ENGINEER,
        email: 'jordan@taskify.com',
      },
      {
        name: 'Taylor Swift',
        role: UserRole.ENGINEER,
        email: 'taylor@taskify.com',
      },
      {
        name: 'Morgan Davis',
        role: UserRole.ENGINEER,
        email: 'morgan@taskify.com',
      },
    ],
  })

  console.log(`👥 Created ${users.count} users`)

  // Fetch created users for references
  const createdUsers = await prisma.user.findMany()
  const sarah = createdUsers.find(u => u.email === 'sarah@taskify.com')!
  const alex = createdUsers.find(u => u.email === 'alex@taskify.com')!
  const jordan = createdUsers.find(u => u.email === 'jordan@taskify.com')!
  const taylor = createdUsers.find(u => u.email === 'taylor@taskify.com')!
  const morgan = createdUsers.find(u => u.email === 'morgan@taskify.com')!

  // Create Projects (3 total)
  const projects = await prisma.project.createMany({
    data: [
      {
        name: 'E-commerce Platform',
        description: 'Building new online store',
      },
      {
        name: 'Mobile App Redesign',
        description: 'Updating user interface',
      },
      {
        name: 'API Documentation',
        description: 'Technical documentation project',
      },
    ],
  })

  console.log(`📁 Created ${projects.count} projects`)

  // Fetch created projects for references
  const createdProjects = await prisma.project.findMany()
  const ecommerce = createdProjects.find(p => p.name === 'E-commerce Platform')!
  const mobile = createdProjects.find(p => p.name === 'Mobile App Redesign')!
  const docs = createdProjects.find(p => p.name === 'API Documentation')!

  // Helper function to get random user for assignment (60% chance)
  const getRandomAssignedUser = (): string | null => {
    if (Math.random() < 0.4) return null // 40% unassigned
    const users = [alex, jordan, taylor, morgan]
    const selectedUser = users[Math.floor(Math.random() * users.length)]
    return selectedUser?.id ?? null
  }

  // Helper function to get random status with distribution
  const getRandomStatus = (): TaskStatus => {
    const rand = Math.random()
    if (rand < 0.4) return TaskStatus.TODO // 40%
    if (rand < 0.7) return TaskStatus.IN_PROGRESS // 30%
    if (rand < 0.9) return TaskStatus.IN_REVIEW // 20%
    return TaskStatus.DONE // 10%
  }

  // Create Tasks for E-commerce Platform (10 tasks)
  const ecommerceTasks = []
  const ecommerceTaskData = [
    { title: 'Set up product catalog database', description: 'Design and implement product schema' },
    { title: 'Implement user authentication', description: 'Add login/logout functionality' },
    { title: 'Create shopping cart feature', description: 'Allow users to add/remove items' },
    { title: 'Integrate payment gateway', description: 'Set up Stripe payment processing' },
    { title: 'Build admin dashboard', description: 'Admin interface for managing products' },
    { title: 'Add order history page', description: 'Users can view past purchases' },
    { title: 'Implement search functionality', description: 'Search products by name/category' },
    { title: 'Create wishlist feature', description: 'Users can save favorite items' },
    { title: 'Set up email notifications', description: 'Order confirmations and updates' },
    { title: 'Add product reviews', description: 'Rating and review system' },
  ]

  for (let i = 0; i < ecommerceTaskData.length; i++) {
    const task = await prisma.task.create({
      data: {
        title: ecommerceTaskData[i].title,
        description: ecommerceTaskData[i].description,
        status: getRandomStatus(),
        position: i,
        projectId: ecommerce.id,
        assignedUserId: getRandomAssignedUser(),
      },
    })
    ecommerceTasks.push(task)
  }

  // Create Tasks for Mobile App Redesign (9 tasks)
  const mobileTaskData = [
    { title: 'Design new onboarding flow', description: 'Improve first-time user experience' },
    { title: 'Redesign navigation menu', description: 'More intuitive menu structure' },
    { title: 'Update color scheme', description: 'Modern and accessible colors' },
    { title: 'Optimize for tablets', description: 'Better tablet layout support' },
    { title: 'Add dark mode support', description: 'Toggle between light/dark themes' },
    { title: 'Improve loading animations', description: 'Smooth transitions and feedback' },
    { title: 'Update app icons', description: 'New iconography system' },
    { title: 'Redesign profile page', description: 'Better user profile layout' },
    { title: 'Add accessibility features', description: 'Screen reader and voice support' },
  ]

  const mobileTasks = []
  for (let i = 0; i < mobileTaskData.length; i++) {
    const task = await prisma.task.create({
      data: {
        title: mobileTaskData[i].title,
        description: mobileTaskData[i].description,
        status: getRandomStatus(),
        position: i,
        projectId: mobile.id,
        assignedUserId: getRandomAssignedUser(),
      },
    })
    mobileTasks.push(task)
  }

  // Create Tasks for API Documentation (8 tasks)
  const docsTaskData = [
    { title: 'Document authentication endpoints', description: 'Login, logout, token refresh' },
    { title: 'Document user management API', description: 'User CRUD operations' },
    { title: 'Document project API endpoints', description: 'Project creation and management' },
    { title: 'Document task API endpoints', description: 'Task CRUD and status updates' },
    { title: 'Create API usage examples', description: 'Code samples for each endpoint' },
    { title: 'Add error handling guide', description: 'Common errors and solutions' },
    { title: 'Set up interactive API explorer', description: 'Swagger/OpenAPI interface' },
    { title: 'Write integration tutorials', description: 'Step-by-step implementation guides' },
  ]

  const docsTasks = []
  for (let i = 0; i < docsTaskData.length; i++) {
    const task = await prisma.task.create({
      data: {
        title: docsTaskData[i].title,
        description: docsTaskData[i].description,
        status: getRandomStatus(),
        position: i,
        projectId: docs.id,
        assignedUserId: getRandomAssignedUser(),
      },
    })
    docsTasks.push(task)
  }

  console.log(`📋 Created ${ecommerceTasks.length + mobileTasks.length + docsTasks.length} tasks`)

  // Create Comments (0-3 per task)
  const allTasks = [...ecommerceTasks, ...mobileTasks, ...docsTasks]
  let totalComments = 0

  for (const task of allTasks) {
    const numComments = Math.floor(Math.random() * 4) // 0-3 comments
    for (let i = 0; i < numComments; i++) {
      const randomUser = [sarah, alex, jordan, taylor, morgan][Math.floor(Math.random() * 5)]
      const commentTexts = [
        'This looks good to me! Ready for review.',
        'I think we need to discuss the implementation approach.',
        'Great progress on this task!',
        'Should we consider the edge cases here?',
        'This is blocked by the previous task.',
        'Updated the requirements based on feedback.',
        'Testing shows this works as expected.',
        'Need to update documentation for this change.',
      ]

      await prisma.comment.create({
        data: {
          content: commentTexts[Math.floor(Math.random() * commentTexts.length)],
          taskId: task.id,
          userId: randomUser!.id,
        },
      })
      totalComments++
    }
  }

  console.log(`💬 Created ${totalComments} comments`)

  console.log('✅ Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })