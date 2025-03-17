# Installation

Liveblade is a PyBlade module, you first need to install PyBlade inside a virtual environment. To do this, run:  

```bash
pip install pyblade
```  

Once installed, initialize a new project for your preferred Python framework:  

```bash
pyblade init
```  

During the project initialization, PyBlade will ask whether you want to enable Liveblade:  

- If you select **Yes**, Liveblade will be fully configured, and you can start using it right away.  
- If you select **No**, Liveblade won’t be set up initially, but you can enable it later by running:  

  ```bash
  pyblade liveblade:install
  ```  

This command will automatically configure everything for you. If you’d like to understand the setup process in detail, check the [manual configuration](/getting-started#manual-configuration) section.