import { Request, Response, NextFunction } from 'express';
import { Empresa, EmpresaFilters } from '../models/empresa.model';
import * as empresaService from '../services/empresa.service';

export const listarEmpresas = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filters: EmpresaFilters = {
      nome: req.query.nome as string,
      categoria: req.query.categoria ? parseInt(req.query.categoria as string) : undefined,
      subcategorias: req.query.subcategorias ? JSON.parse(req.query.subcategorias as string) : undefined,
      estado: req.query.estado as string,
      cidade: req.query.cidade as string,
      ramo_atuacao: req.query.ramo_atuacao as string,
      status: 'verificado', // busca pública sempre mostra apenas verificadas
      pagina: req.query.pagina ? parseInt(req.query.pagina as string) : 1,
      limite: req.query.limite ? parseInt(req.query.limite as string) : 10
    };

    const resultado = await empresaService.listarEmpresas(filters);

    res.status(200).json({
      success: true,
      data: resultado.empresas,
      pagination: {
        pagina: filters.pagina,
        limite: filters.limite,
        total: resultado.total,
        paginas: Math.ceil(resultado.total / (filters.limite || 10))
      }
    });
  } catch (error) {
    next(error);
  }
};

export const obterEmpresa = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const empresa = await empresaService.obterEmpresaPorId(parseInt(id));

    if (!empresa) {
      res.status(404).json({
        success: false,
        message: 'Empresa não encontrada'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: empresa
    });
  } catch (error) {
    next(error);
  }
};

export const cadastrarEmpresa = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const empresaData: Empresa = req.body;

    // Validação básica
    if (!empresaData.cpf || !empresaData.razao_social || !empresaData.cnpj) {
      res.status(400).json({
        success: false,
        message: 'CPF, razão social e CNPJ são obrigatórios'
      });
      return;
    }

    // Verificar se CPF é válido na base IDEBRASIL
    const cpfValido = await empresaService.validarCpfIdebrasil(empresaData.cpf);
    if (!cpfValido) {
      res.status(400).json({
        success: false,
        message: 'CPF não encontrado na base de alunos IDEBRASIL. Entre em contato conosco.'
      });
      return;
    }

    const empresa = await empresaService.criarEmpresa(empresaData);

    res.status(201).json({
      success: true,
      message: 'Empresa cadastrada com sucesso. Aguardando verificação.',
      data: empresa
    });
  } catch (error) {
    next(error);
  }
};

export const atualizarEmpresa = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const empresaData: Partial<Empresa> = req.body;

    const empresa = await empresaService.atualizarEmpresa(parseInt(id), empresaData);

    if (!empresa) {
      res.status(404).json({
        success: false,
        message: 'Empresa não encontrada'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Empresa atualizada com sucesso',
      data: empresa
    });
  } catch (error) {
    next(error);
  }
};

export const excluirEmpresa = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const sucesso = await empresaService.excluirEmpresa(parseInt(id));

    if (!sucesso) {
      res.status(404).json({
        success: false,
        message: 'Empresa não encontrada'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Empresa excluída com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

export const obterEstatisticas = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = await empresaService.obterEstatisticas();

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};