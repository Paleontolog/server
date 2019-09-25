import PyInstaller.__main__
import os

PyInstaller.__main__.run([
    '--name=%s' % "keyboard",
    '--onefile',
    '--noconsole',
    '--clean',
    os.path.join('key.py')
])