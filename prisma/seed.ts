import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
      description: 'Administrator role with full access',
      permissions: [
        'manage_users',
        'manage_subscriptions',
        'manage_payments',
        'manage_content',
        'manage_settings',
        'view_analytics',
        'manage_referrals',
      ],
      isActive: true,
    },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'USER' },
    update: {},
    create: {
      name: 'USER',
      description: 'Regular user role',
      permissions: ['view_content', 'manage_profile', 'view_referrals'],
      isActive: true,
    },
  });

  console.log('✅ Roles created');

  // Create subscription plans
  const monthlyPlan = await prisma.subscriptionPlan.upsert({
    where: { slug: 'monthly' },
    update: {},
    create: {
      name: 'Monthly',
      slug: 'monthly',
      description: 'Monthly subscription plan',
      monthlyPrice: 9.99,
      halfYearlyPrice: 49.99,
      yearlyPrice: 99.99,
      currency: 'USD',
      videoAccess: true,
      audioAccess: true,
      liveSessionAccess: false,
      downloadAccess: false,
      adFree: true,
      features: ['Unlimited Video Access', 'Unlimited Audio Access', 'Ad-Free Experience'],
      isActive: true,
      displayOrder: 1,
    },
  });

  const premiumPlan = await prisma.subscriptionPlan.upsert({
    where: { slug: 'premium' },
    update: {},
    create: {
      name: 'Premium',
      slug: 'premium',
      description: 'Premium subscription with all features',
      monthlyPrice: 19.99,
      halfYearlyPrice: 99.99,
      yearlyPrice: 199.99,
      currency: 'USD',
      videoAccess: true,
      audioAccess: true,
      liveSessionAccess: true,
      downloadAccess: true,
      adFree: true,
      features: [
        'Unlimited Video Access',
        'Unlimited Audio Access',
        'Live Session Access',
        'Download For Offline',
        'Ad-Free Experience',
      ],
      isActive: true,
      displayOrder: 2,
    },
  });

  console.log('✅ Subscription plans created');

  // Create categories
  const yogaCategory = await prisma.category.upsert({
    where: { slug: 'yoga' },
    update: {},
    create: {
      name: 'Yoga',
      slug: 'yoga',
      description: 'Yoga practices and asanas',
      icon: '🧘',
      color: '#7BAE7F',
      isActive: true,
      displayOrder: 1,
    },
  });

  const meditationCategory = await prisma.category.upsert({
    where: { slug: 'meditation' },
    update: {},
    create: {
      name: 'Meditation',
      slug: 'meditation',
      description: 'Guided meditation sessions',
      icon: '🧠',
      color: '#B8A9D9',
      isActive: true,
      displayOrder: 2,
    },
  });

  console.log('✅ Categories created');

  // Create instructors
  const instructor1 = await prisma.instructor.upsert({
    where: { id: 'instructor_1' },
    update: {},
    create: {
      id: 'instructor_1',
      name: 'Priya Sharma',
      bio: 'Certified yoga instructor with 10+ years of experience',
      specialization: ['Hatha Yoga', 'Vinyasa Flow', 'Meditation'],
      experience: 10,
      isActive: true,
    },
  });

  console.log('✅ Instructors created');

  // Create tags
  const relaxTag = await prisma.tag.upsert({
    where: { slug: 'relaxation' },
    update: {},
    create: {
      name: 'Relaxation',
      slug: 'relaxation',
    },
  });

  const stressTag = await prisma.tag.upsert({
    where: { slug: 'stress-relief' },
    update: {},
    create: {
      name: 'Stress Relief',
      slug: 'stress-relief',
    },
  });

  console.log('✅ Tags created');

  // Create settings
  await prisma.setting.upsert({
    where: { key: 'app_name' },
    update: {},
    create: {
      key: 'app_name',
      value: 'Yoga & Meditation',
      description: 'Application name',
      isPublic: true,
    },
  });

  await prisma.setting.upsert({
    where: { key: 'support_email' },
    update: {},
    create: {
      key: 'support_email',
      value: 'support@yogaandmeditation.com',
      description: 'Support email address',
      isPublic: true,
    },
  });

  console.log('✅ Settings created');

  // Create email templates
  await prisma.emailTemplate.upsert({
    where: { slug: 'welcome' },
    update: {},
    create: {
      name: 'Welcome Email',
      slug: 'welcome',
      subject: 'Welcome to {{app_name}}',
      template: '<h1>Welcome {{name}}!</h1><p>Thank you for joining us.</p>',
      variables: ['name', 'app_name'],
      isActive: true,
    },
  });

  await prisma.emailTemplate.upsert({
    where: { slug: 'password_reset' },
    update: {},
    create: {
      name: 'Password Reset',
      slug: 'password_reset',
      subject: 'Reset your password',
      template: '<h1>Password Reset</h1><p>Click <a href="{{reset_link}}">here</a> to reset your password.</p>',
      variables: ['reset_link'],
      isActive: true,
    },
  });

  console.log('✅ Email templates created');

  // Create referral commission config
  await prisma.referralCommissionConfig.upsert({
    where: { id: 'default_config' },
    update: {},
    create: {
      id: 'default_config',
      name: 'Default Commission Configuration',
      description: 'Default multi-level referral commission rules',
      level1Percent: 10,
      level2Percent: 5,
      level3Percent: 2,
      minRefAmount: 0,
      maxReward: null,
      validityDays: 365,
      isActive: true,
    },
  });

  console.log('✅ Referral commission config created');

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
