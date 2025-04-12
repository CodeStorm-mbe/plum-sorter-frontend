import { useState } from 'react';
import { AppShell, Burger, Group, NavLink, Avatar, Text, UnstyledButton, Menu, rem, Divider, Title, useMantineColorScheme, ActionIcon, Box } from '@mantine/core';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  IconDashboard, 
  IconFarm, 
  IconApple, 
  IconPackages, 
  IconChartBar, 
  IconSettings, 
  IconLogout, 
  IconUser,
  IconSun,
  IconMoon,
  IconBell
} from '@tabler/icons-react';

export function DashboardLayout() {
  const [opened, setOpened] = useState(false);
  const { user, logout } = useAuth();
  const { colorScheme, toggleColorScheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { setColorScheme } = useMantineColorScheme();

  const handleLogout = () => {
    logout();
  };

  const handleToggleTheme = () => {
    toggleColorScheme();
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  };

  const navItems = [
    { label: 'Tableau de bord', icon: <IconDashboard size={20} />, path: '/dashboard' },
    { label: 'Fermes', icon: <IconFarm size={20} />, path: '/dashboard/farms' },
    { label: 'Classification', icon: <IconApple size={20} />, path: '/dashboard/classification' },
    { label: 'Lots', icon: <IconPackages size={20} />, path: '/dashboard/batches' },
    { label: 'Statistiques', icon: <IconChartBar size={20} />, path: '/dashboard/statistics' },
    { label: 'Paramètres', icon: <IconSettings size={20} />, path: '/dashboard/settings' },
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              hiddenFrom="sm"
              size="sm"
            />
            <Title order={3} c="plum">Classification des Prunes</Title>
          </Group>
          <Group>
            <ActionIcon 
              variant="default" 
              onClick={handleToggleTheme} 
              aria-label="Changer de thème"
            >
              {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
            </ActionIcon>
            <ActionIcon variant="default" aria-label="Notifications">
              <IconBell size={18} />
            </ActionIcon>
            <Menu position="bottom-end" withArrow shadow="md">
              <Menu.Target>
                <UnstyledButton>
                  <Group>
                    <Avatar color="plum" radius="xl">
                      {user?.first_name?.[0] || user?.username?.[0] || 'U'}
                    </Avatar>
                    <Box style={{ flex: 1 }}>
                      <Text size="sm" fw={500}>
                        {user?.first_name && user?.last_name 
                          ? `${user.first_name} ${user.last_name}` 
                          : user?.username}
                      </Text>
                      <Text c="dimmed" size="xs">
                        {user?.email}
                      </Text>
                    </Box>
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Compte</Menu.Label>
                <Menu.Item leftSection={<IconUser style={{ width: rem(14), height: rem(14) }} />} onClick={() => navigate('/dashboard/profile')}>
                  Mon profil
                </Menu.Item>
                <Menu.Item leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />} onClick={() => navigate('/dashboard/settings')}>
                  Paramètres
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item 
                  color="red" 
                  leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
                  onClick={handleLogout}
                >
                  Se déconnecter
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section grow>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              label={item.label}
              leftSection={item.icon}
              active={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              variant="filled"
              mb={8}
            />
          ))}
        </AppShell.Section>
        
        <AppShell.Section>
          <Divider my="sm" />
          <Group justify="space-between" px="sm">
            <Text size="xs" c="dimmed">
              © 2025 Classification des Prunes
            </Text>
            <Text size="xs" c="dimmed">
              v1.0.0
            </Text>
          </Group>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

export default DashboardLayout;
