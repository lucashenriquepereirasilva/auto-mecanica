// Exibir versão do Electron
console.log(`Electron: ${process.versions.electron}`);

const { app, BrowserWindow, nativeTheme, Menu, shell } = require('electron');
const path = require('path');

// Janela principal
let win;
const createWindow = () => {
  nativeTheme.themeSource = 'dark';
  win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: './src/public/img/chave-inglesa.png', // Ícone temático para motores
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Menu personalizado
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  win.loadFile('./src/views/index.html');
};

// Janela "Sobre"
let about;
const aboutWindow = () => {
  if (about) {
    about.focus();
    return;
  }

  about = new BrowserWindow({
    width: 360,
    height: 220,
    icon: './src/img/engine.png',
    autoHideMenuBar: true,
    resizable: false,
    parent: BrowserWindow.getFocusedWindow(),
    modal: true
  });

  about.loadFile('./src/views/sobre.html');

  about.on('closed', () => {
    about = null;
  });
};

// Janela secundária (exemplo: "Detalhes do Motor")
const engineDetailsWindow = () => {
  const father = BrowserWindow.getFocusedWindow();
  if (father) {
    const child = new BrowserWindow({
      width: 640,
      height: 220,
      icon: './src/img/engine.png',
      autoHideMenuBar: true,
      resizable: false,
      parent: father,
      modal: true
    });

    child.loadFile('./src/views/engine_details.html');
  }
};

// Iniciar aplicação
app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Fechar todas as janelas quando a principal for fechada
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Reduzir logs
app.commandLine.appendSwitch('log-level', '3');

// Menu do sistema
const template = [
  {
    label: 'Cadastro',
    submenu: [
      { label: 'Clientes' },
      { label: 'Veículos' },
      { label: 'Motores' },
      { label: 'Ordens de Serviço (OS)' },
      { type: 'separator' },
      { label: 'Sair', click: () => app.quit(), accelerator: 'ALT+F4' }
    ]
  },
  {
    label: 'Relatórios',
    submenu: [
      { label: 'Clientes Cadastrados' },
      { label: 'Serviços Concluídos' },
      { label: 'Motores Revisados' },
      { label: 'OS Abertas' }
    ]
  },
  {
    label: 'Serviços',
    submenu: [
      { label: 'Nova Ordem de Serviço' },
      { label: 'Histórico de Manutenções' },
      { type: 'separator' },
      { label: 'Detalhes do Motor', click: () => engineDetailsWindow() }
    ]
  },
  {
    label: 'Exibir',
    submenu: [
      { label: 'Recarregar', role: 'reload' },
      { label: 'Ferramentas do Desenvolvedor', role: 'toggleDevTools' },
      { type: 'separator' },
      { label: 'Aplicar Zoom', role: 'zoomIn' },
      { label: 'Reduzir Zoom', role: 'zoomOut' },
      { label: 'Restaurar Zoom Padrão', role: 'resetZoom' }
    ]
  },
  {
    label: 'Ajuda',
    submenu: [
      {
        label: 'Documentação',
        click: () => shell.openExternal('https://github.com/lucashenriquepereirasilva/Lucas.TI')
      },
      { type: 'separator' },
      { label: 'Sobre', click: () => aboutWindow() }
    ]
  }
];
