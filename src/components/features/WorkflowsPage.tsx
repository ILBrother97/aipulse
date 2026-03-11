import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import {
  Plus, Play, Edit2, Trash2, ArrowRight, Star, Search,
  Clock, BarChart2, Copy, ChevronRight, X, Zap, Check,
  PanelRight, ClipboardCopy, ExternalLink, Variable, MoreVertical,
  ChevronUp, ChevronDown, GripVertical, Lock,
} from 'lucide-react';
import { useToolsStore } from '../../stores/toolsStore';
import { usePremium } from '@/hooks/usePremium';
import { toast } from '../../stores/toastStore';
import { cn } from '../../utils/cn';
import { Button } from '../ui';
import { PremiumGate } from '@/components/premium';
import type { Workflow, WorkflowStep, AITool } from '../../types/index';
import { v4 as uuidv4 } from 'uuid';

// ── Pre-built Templates ───────────────────────────────────────────────
const TEMPLATES: Omit<Workflow, 'id' | 'createdAt' | 'useCount'>[] = [
  {
    name: 'Video Production Pipeline',
    description: 'Script → Video → Voiceover with data passing',
    steps: [
      { id: 'temp1', toolId: '', order: 0, note: 'Write video script about your topic', outputVar: 'script', autoFillUrl: false },
      { id: 'temp2', toolId: '', order: 1, note: 'Paste script here to generate video', inputVar: '{{script}}', outputVar: 'video', autoFillUrl: true },
      { id: 'temp3', toolId: '', order: 2, note: 'Use script for professional voiceover', inputVar: '{{script}}', outputVar: 'voiceover', autoFillUrl: true },
    ],
    isFavorite: false,
  },
  {
    name: 'Content Creation Suite',
    description: 'Generate, refine, and visualize content end-to-end',
    steps: [],
    isFavorite: false,
  },
  {
    name: 'Blog Writing Flow',
    description: 'Research, outline, write, and illustrate blog posts',
    steps: [],
    isFavorite: false,
  },
];

export default function WorkflowsPage() {
  const [view, setView] = useState<'list' | 'builder'>('list');
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRunner, setShowRunner] = useState(false);

  const FREE_LIMIT = 1;

  const {
    workflows, addWorkflow, updateWorkflow, deleteWorkflow, tools,
    activeExecution, startWorkflowExecution, setExecutionStep, setStepOutput,
    getStepInput, endWorkflowExecution,
  } = useToolsStore();

  const { isPremium, openUpgradeModal } = usePremium();

  const filtered = workflows.filter((w) =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateNew = () => {
    if (!isPremium && workflows.length >= FREE_LIMIT) {
      openUpgradeModal();
      return;
    }
    setEditingWorkflow({
      id: '',
      name: 'New Workflow',
      description: '',
      steps: [],
      createdAt: Date.now(),
      useCount: 0,
    });
    setView('builder');
  };

  const handleEditWorkflow = (wf: Workflow) => {
    setEditingWorkflow({ ...wf });
    setView('builder');
  };

  const handleDuplicate = (wf: Workflow) => {
    addWorkflow({
      name: `${wf.name} (Copy)`,
      description: wf.description,
      steps: wf.steps.map((s) => ({ ...s, id: uuidv4() })),
    });
    toast.success(`Duplicated "${wf.name}"`);
  };

  const handleDeleteWorkflow = (id: string) => {
    deleteWorkflow(id);
    toast.success('Workflow deleted');
  };

  const handleSave = () => {
    if (!editingWorkflow) return;
    if (!editingWorkflow.name.trim()) {
      toast.error('Workflow name is required');
      return;
    }
    if (editingWorkflow.steps.length === 0) {
      toast.error('Add at least one step to your workflow');
      return;
    }
    if (editingWorkflow.id) {
      updateWorkflow(editingWorkflow.id, editingWorkflow);
      toast.success('Workflow updated');
    } else {
      addWorkflow({
        name: editingWorkflow.name,
        description: editingWorkflow.description,
        steps: editingWorkflow.steps,
      });
      toast.success('Workflow created');
    }
    setView('list');
    setEditingWorkflow(null);
  };

  const handleExecute = (wf: Workflow) => {
    if (wf.steps.length === 0) {
      toast.error('This workflow has no steps');
      return;
    }
    startWorkflowExecution(wf.id);
    setShowRunner(true);
    toast.success(`Starting "${wf.name}"`);
  };

  const handleTemplateCreate = (template: typeof TEMPLATES[number]) => {
    addWorkflow({ name: template.name, description: template.description, steps: template.steps.map(s => ({ ...s, id: uuidv4() })) });
    toast.success(`Created workflow from template`);
  };

  // ── Running Workflow Panel ──────────────────────────────────────────
  const runningWorkflow = activeExecution ? workflows.find((w) => w.id === activeExecution.workflowId) : null;

  if (view === 'builder' && editingWorkflow) {
    // Allow viewing the 1 free workflow, but gate additional editing
    const shouldGate = !isPremium && workflows.length > FREE_LIMIT;
    
    return (
      <PremiumGate feature="Workflow Automation" variant={shouldGate ? 'blur' : 'soft'}>
        <WorkflowBuilder
          workflow={editingWorkflow}
          onChange={setEditingWorkflow}
          onSave={handleSave}
          onCancel={() => { setView('list'); setEditingWorkflow(null); }}
          tools={tools}
        />
      </PremiumGate>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-text-primary">Workflows</h1>
          <p className="text-gray-600 dark:text-text-secondary text-sm mt-1">Chain AI tools with data passing</p>
        </div>
        <div className="relative">
          <Button 
            onClick={handleCreateNew} 
            leftIcon={<Plus className="w-5 h-5" />}
            disabled={!isPremium && workflows.length >= FREE_LIMIT}
            className={!isPremium && workflows.length >= FREE_LIMIT ? 'opacity-50 cursor-not-allowed' : ''}
            title={!isPremium && workflows.length >= FREE_LIMIT ? 'Upgrade to create unlimited workflows' : ''}
          >
            {!isPremium && workflows.length >= FREE_LIMIT && <Lock className="w-4 h-4 mr-1" />}
            Create Workflow
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-text-muted" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search workflows..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-background-card border-2 border-gray-200 dark:border-border rounded-xl text-sm text-gray-900 dark:text-text-primary placeholder:text-gray-400 dark:placeholder:text-text-muted focus:border-primary outline-none transition-colors"
        />
      </div>

      {/* Active Runner Panel */}
      <AnimatePresence>
        {showRunner && runningWorkflow && activeExecution && (
          <WorkflowRunner
            workflow={runningWorkflow}
            execution={activeExecution}
            tools={tools}
            onClose={() => { setShowRunner(false); endWorkflowExecution(); }}
            onNextStep={() => setExecutionStep(activeExecution.currentStepIndex + 1)}
            onSetOutput={(stepId, output) => setStepOutput(stepId, output)}
            getStepInput={getStepInput}
          />
        )}
      </AnimatePresence>

      {/* Workflows List */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((wf, i) => (
            <WorkflowCard
              key={wf.id}
              workflow={wf}
              tools={tools}
              index={i}
              onEdit={() => handleEditWorkflow(wf)}
              onDelete={() => handleDeleteWorkflow(wf.id)}
              onDuplicate={() => handleDuplicate(wf)}
              onExecute={() => handleExecute(wf)}
              onToggleFavorite={() => updateWorkflow(wf.id, { isFavorite: !wf.isFavorite })}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-background-card flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-gray-400 dark:text-text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary mb-2">
            {searchQuery ? 'No workflows found' : 'No workflows yet'}
          </h3>
          <p className="text-gray-600 dark:text-text-secondary text-sm max-w-sm mx-auto mb-6">
            {searchQuery ? `No workflows match "${searchQuery}"` : 'Create a workflow to chain AI tools into powerful sequences.'}
          </p>
          {!searchQuery && (
            <Button 
              onClick={handleCreateNew} 
              leftIcon={<Plus className="w-4 h-4" />}
              disabled={!isPremium && workflows.length >= FREE_LIMIT}
              className={!isPremium && workflows.length >= FREE_LIMIT ? 'opacity-50 cursor-not-allowed' : ''}
            >
              {!isPremium && workflows.length >= FREE_LIMIT && <Lock className="w-4 h-4 mr-1" />}
              Create Your First Workflow
            </Button>
          )}
        </div>
      )}

      {/* Templates */}
      {workflows.length === 0 && !searchQuery && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-text-primary mb-4">Start from a Template</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TEMPLATES.map((t) => (
              <button
                key={t.name}
                onClick={() => {
                  if (!isPremium && workflows.length >= FREE_LIMIT) {
                    openUpgradeModal();
                    return;
                  }
                  handleTemplateCreate(t);
                }}
                disabled={!isPremium && workflows.length >= FREE_LIMIT}
                className={cn(
                  "text-left p-4 bg-white dark:bg-background-card border-2 border-gray-200 dark:border-border rounded-2xl hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200 group",
                  (!isPremium && workflows.length >= FREE_LIMIT) ? "opacity-50 cursor-not-allowed" : ""
                )}
              >
                <h4 className="font-medium text-gray-900 dark:text-text-primary mb-1 group-hover:text-primary transition-colors">{t.name}</h4>
                <p className="text-xs text-gray-500 dark:text-text-muted">{t.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Premium Limit Banner */}
      {!isPremium && workflows.length >= FREE_LIMIT && (
        <PremiumGate 
          feature="Unlimited Workflows" 
          variant="limit" 
          limitCurrent={workflows.length} 
          limitMax={FREE_LIMIT} 
        />
      )}
    </motion.div>
  );
}

// ── Workflow Runner Panel ─────────────────────────────────────────────

interface WorkflowRunnerProps {
  workflow: Workflow;
  execution: { workflowId: string; currentStepIndex: number; variables: Record<string, string>; completedSteps: string[] };
  tools: AITool[];
  onClose: () => void;
  onNextStep: () => void;
  onSetOutput: (stepId: string, output: string) => void;
  getStepInput: (step: WorkflowStep) => string;
}

function WorkflowRunner({ workflow, execution, tools, onClose, onNextStep, onSetOutput, getStepInput }: WorkflowRunnerProps) {
  const [outputText, setOutputText] = useState('');
  const currentStep = workflow.steps[execution.currentStepIndex];
  const currentTool = currentStep ? tools.find((t) => t.id === currentStep.toolId) : null;
  const isLastStep = execution.currentStepIndex >= workflow.steps.length - 1;
  const progress = ((execution.currentStepIndex) / workflow.steps.length) * 100;

  const stepInput = currentStep ? getStepInput(currentStep) : '';

  const handleLaunch = () => {
    if (!currentTool) return;
    let url = currentTool.url;
    // If autoFillUrl is enabled and we have input, try to append as query param
    if (currentStep?.autoFillUrl && stepInput) {
      const separator = url.includes('?') ? '&' : '?';
      url = `${url}${separator}text=${encodeURIComponent(stepInput.slice(0, 500))}`;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSaveOutput = () => {
    if (!currentStep || !outputText.trim()) return;
    onSetOutput(currentStep.id, outputText.trim());
    setOutputText('');
    toast.success('Output saved for next step');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-2 border-primary/30 rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-primary/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Play className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-primary font-semibold">Running: {workflow.name}</p>
            <p className="text-xs text-gray-500 dark:text-text-muted">Step {execution.currentStepIndex + 1} of {workflow.steps.length}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg text-gray-500 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary hover:bg-primary/10 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-200 dark:bg-background-dark">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Step visualization */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-600 dark:text-text-secondary uppercase tracking-wide">Workflow Steps</h3>
          <div className="space-y-2">
            {workflow.steps.map((step, idx) => {
              const tool = tools.find((t) => t.id === step.toolId);
              const isCurrent = idx === execution.currentStepIndex;
              const isCompleted = execution.completedSteps.includes(step.id);
              const IconComp = tool?.icon ? (LucideIcons[tool.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>) : null;

              return (
                <div
                  key={step.id}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-xl border-2 transition-all',
                    isCurrent ? 'border-primary bg-primary/10' : isCompleted ? 'border-green-500/30 bg-green-500/5' : 'border-gray-200 dark:border-border bg-gray-100 dark:bg-background-dark'
                  )}
                >
                  <div className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
                    isCurrent ? 'bg-primary text-black' : isCompleted ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-border text-gray-600 dark:text-text-muted'
                  )}>
                    {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-background-card flex items-center justify-center flex-shrink-0">
                    {IconComp ? <IconComp className="w-4 h-4 text-primary" /> : <Zap className="w-4 h-4 text-primary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-sm font-medium truncate', isCurrent ? 'text-primary' : 'text-gray-900 dark:text-text-primary')}>
                      {tool?.name || 'Unknown Tool'}
                    </p>
                    {step.note && <p className="text-xs text-gray-500 dark:text-text-muted truncate">{step.note}</p>}
                  </div>
                  {step.outputVar && (
                    <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full flex-shrink-0">
                      → {step.outputVar}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Current Step Action */}
        <div className="space-y-4">
          {currentStep && currentTool ? (
            <>
              <div className="bg-gray-100 dark:bg-background-dark border-2 border-gray-200 dark:border-border rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    {(() => {
                      const Icon = currentTool.icon ? (LucideIcons[currentTool.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>) : null;
                      return Icon ? <Icon className="w-5 h-5 text-primary" /> : <Zap className="w-5 h-5 text-primary" />;
                    })()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-text-primary">{currentTool.name}</p>
                    <p className="text-xs text-gray-500 dark:text-text-muted">{currentTool.category}</p>
                  </div>
                </div>

                {currentStep.note && (
                  <div className="mb-3 p-3 bg-white dark:bg-background-card rounded-lg border border-gray-200 dark:border-border">
                    <p className="text-xs text-gray-600 dark:text-text-secondary">{currentStep.note}</p>
                  </div>
                )}

                {/* Input from previous step */}
                {stepInput && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-gray-600 dark:text-text-secondary flex items-center gap-1">
                        <Variable className="w-3 h-3" /> Input from previous step
                      </span>
                      <button onClick={() => copyToClipboard(stepInput)} className="text-xs text-primary hover:underline">
                        Copy
                      </button>
                    </div>
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <p className="text-sm text-gray-900 dark:text-text-primary line-clamp-4 font-mono">{stepInput}</p>
                    </div>
                  </div>
                )}

                {/* Launch button */}
                <Button onClick={handleLaunch} leftIcon={<ExternalLink className="w-4 h-4" />} className="w-full">
                  {stepInput ? 'Open Tool with Input' : 'Open Tool'}
                </Button>
              </div>

              {/* Output capture */}
              <div className="bg-gray-100 dark:bg-background-dark border-2 border-gray-200 dark:border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-text-secondary flex items-center gap-1">
                    <ClipboardCopy className="w-3.5 h-3.5" /> Capture Output
                  </span>
                  {currentStep.outputVar && (
                    <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      Saves as: {currentStep.outputVar}
                    </span>
                  )}
                </div>
                <textarea
                  value={outputText}
                  onChange={(e) => setOutputText(e.target.value)}
                  placeholder="Paste the output from the tool here..."
                  rows={3}
                  className="w-full bg-background-card border-2 border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-primary outline-none resize-none mb-2"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleSaveOutput}
                    disabled={!outputText.trim()}
                    className="flex-1"
                  >
                    Save Output
                  </Button>
                  {execution.completedSteps.includes(currentStep.id) && !isLastStep && (
                    <Button size="sm" onClick={onNextStep} leftIcon={<ChevronRight className="w-4 h-4" />}>
                      Next Step
                    </Button>
                  )}
                  {isLastStep && execution.completedSteps.includes(currentStep.id) && (
                    <Button size="sm" onClick={onClose} className="bg-green-500 hover:bg-green-600">
                      <Check className="w-4 h-4 mr-1" /> Complete
                    </Button>
                  )}
                </div>
              </div>

              {/* Variables overview */}
              {Object.keys(execution.variables).length > 0 && (
                <div className="bg-background-dark border-2 border-border rounded-xl p-4">
                  <h4 className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-2">Saved Variables</h4>
                  <div className="space-y-1.5">
                    {Object.entries(execution.variables).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2 text-xs">
                        <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded font-mono">{key}</span>
                        <span className="text-text-muted truncate flex-1">{value.slice(0, 50)}{value.length > 50 ? '...' : ''}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <Check className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-lg font-semibold text-text-primary">Workflow Complete!</p>
              <p className="text-text-secondary text-sm mb-4">All steps finished successfully.</p>
              <Button onClick={onClose}>Close Runner</Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Workflow Card ─────────────────────────────────────────────────────

interface WorkflowCardProps {
  workflow: Workflow;
  tools: AITool[];
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onExecute: () => void;
  onToggleFavorite: () => void;
}

function WorkflowCard({ workflow, tools, index, onEdit, onDelete, onDuplicate, onExecute, onToggleFavorite }: WorkflowCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const stepTools = workflow.steps
    .slice(0, 4)
    .map((s) => tools.find((t) => t.id === s.toolId))
    .filter((t): t is AITool => !!t);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-background-card border-2 border-gray-200 dark:border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-text-primary truncate">{workflow.name}</h3>
            {workflow.isFavorite && <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />}
          </div>
          {workflow.description && <p className="text-xs text-gray-500 dark:text-text-muted mt-1 line-clamp-1">{workflow.description}</p>}
        </div>
        <div className="relative flex-shrink-0">
          <button onClick={() => setShowMenu(!showMenu)} className="p-1.5 rounded-lg text-gray-500 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary hover:bg-gray-100 dark:hover:bg-background-dark transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
          {showMenu && (
            <div className="absolute top-8 right-0 z-10 bg-white dark:bg-background-card border-2 border-gray-200 dark:border-border rounded-xl shadow-xl p-1 min-w-[160px]">
              <MenuItem icon={Edit2} label="Edit" onClick={() => { onEdit(); setShowMenu(false); }} />
              <MenuItem icon={Copy} label="Duplicate" onClick={() => { onDuplicate(); setShowMenu(false); }} />
              <MenuItem icon={Star} label={workflow.isFavorite ? 'Unpin' : 'Pin'} onClick={() => { onToggleFavorite(); setShowMenu(false); }} />
              <div className="border-t border-gray-200 dark:border-border my-1" />
              <MenuItem icon={Trash2} label="Delete" onClick={() => { onDelete(); setShowMenu(false); }} danger />
            </div>
          )}
        </div>
      </div>

      {/* Steps visual */}
      <div className="flex items-center gap-1 mb-4 min-h-[32px]">
        {workflow.steps.length === 0 ? (
          <span className="text-xs text-gray-500 dark:text-text-muted">No steps added yet</span>
        ) : (
          <>
            {stepTools.map((tool, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0" title={tool.name}>
                  {(() => {
                    const Icon = tool.icon ? (LucideIcons[tool.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>) : null;
                    return Icon ? <Icon className="w-3.5 h-3.5 text-primary" /> : <Zap className="w-3.5 h-3.5 text-primary" />;
                  })()}
                </div>
                {i < stepTools.length - 1 && <ArrowRight className="w-3 h-3 text-gray-400 dark:text-text-muted flex-shrink-0" />}
              </div>
            ))}
            {workflow.steps.length > 4 && <span className="text-xs text-gray-500 dark:text-text-muted ml-1">+{workflow.steps.length - 4} more</span>}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-text-muted">
          <span className="flex items-center gap-1">
            <LucideIcons.GitBranch className="w-3.5 h-3.5" />
            {workflow.steps.length} {workflow.steps.length === 1 ? 'step' : 'steps'}
          </span>
          {workflow.useCount > 0 && <span className="flex items-center gap-1"><BarChart2 className="w-3.5 h-3.5" /> Used {workflow.useCount}x</span>}
          {workflow.lastUsed && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(workflow.lastUsed).toLocaleDateString()}</span>}
        </div>
        <Button size="sm" onClick={onExecute} leftIcon={<Play className="w-3.5 h-3.5" />}>Run</Button>
      </div>
    </motion.div>
  );
}

function MenuItem({ icon: Icon, label, onClick, danger }: { icon: React.ElementType; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button onClick={onClick} className={cn('w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors', danger ? 'text-red-500 dark:text-red-400 hover:bg-red-500/10' : 'text-gray-600 dark:text-text-secondary hover:text-gray-900 dark:hover:text-text-primary hover:bg-gray-100 dark:hover:bg-background-dark')}>
      <Icon className="w-4 h-4" />{label}
    </button>
  );
}

// ── Workflow Builder ──────────────────────────────────────────────────

interface WorkflowBuilderProps {
  workflow: Workflow;
  onChange: (wf: Workflow) => void;
  onSave: () => void;
  onCancel: () => void;
  tools: AITool[];
}

function WorkflowBuilder({ workflow, onChange, onSave, onCancel, tools }: WorkflowBuilderProps) {
  const [toolSearch, setToolSearch] = useState('');
  const [showToolPicker, setShowToolPicker] = useState(false);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const filteredTools = tools.filter((t) => t.name.toLowerCase().includes(toolSearch.toLowerCase()) || t.category.toLowerCase().includes(toolSearch.toLowerCase()));

  const addStep = (toolId: string) => {
    const newStep: WorkflowStep = {
      id: uuidv4(),
      toolId,
      order: workflow.steps.length,
      outputVar: `step${workflow.steps.length + 1}`,
    };
    onChange({ ...workflow, steps: [...workflow.steps, newStep] });
    setShowToolPicker(false);
    setToolSearch('');
  };

  const removeStep = (stepId: string) => {
    onChange({ ...workflow, steps: workflow.steps.filter((s) => s.id !== stepId).map((s, i) => ({ ...s, order: i })) });
  };

  const moveStep = (idx: number, dir: -1 | 1) => {
    const steps = [...workflow.steps];
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= steps.length) return;
    [steps[idx], steps[newIdx]] = [steps[newIdx], steps[idx]];
    onChange({ ...workflow, steps: steps.map((s, i) => ({ ...s, order: i })) });
  };

  const updateStep = (stepId: string, updates: Partial<WorkflowStep>) => {
    onChange({ ...workflow, steps: workflow.steps.map((s) => (s.id === stepId ? { ...s, ...updates } : s)) });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-4xl">
      {/* Builder Header */}
      <div className="flex items-center gap-4">
        <button onClick={onCancel} className="p-2 rounded-lg text-gray-500 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary hover:bg-gray-100 dark:hover:bg-background-card transition-colors">
          <X className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900 dark:text-text-primary">{workflow.id ? 'Edit Workflow' : 'New Workflow'}</h1>
        </div>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button onClick={onSave}>Save Workflow</Button>
      </div>

      {/* Name & Description */}
      <div className="bg-white dark:bg-background-card border-2 border-gray-200 dark:border-border rounded-2xl p-5 space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-text-secondary mb-1.5 uppercase tracking-wide">Workflow Name *</label>
          <input
            value={workflow.name}
            onChange={(e) => onChange({ ...workflow, name: e.target.value })}
            placeholder="e.g., Video Production Pipeline"
            className="w-full px-4 py-2.5 bg-gray-100 dark:bg-background-dark border-2 border-gray-200 dark:border-border rounded-xl text-gray-900 dark:text-text-primary text-sm focus:border-primary outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-text-secondary mb-1.5 uppercase tracking-wide">Description</label>
          <input
            value={workflow.description || ''}
            onChange={(e) => onChange({ ...workflow, description: e.target.value })}
            placeholder="What does this workflow do?"
            className="w-full px-4 py-2.5 bg-gray-100 dark:bg-background-dark border-2 border-gray-200 dark:border-border rounded-xl text-gray-900 dark:text-text-primary text-sm focus:border-primary outline-none transition-colors"
          />
        </div>
      </div>

      {/* Steps */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-600 dark:text-text-secondary uppercase tracking-wide">Steps ({workflow.steps.length})</h2>
          <div className="text-xs text-gray-500 dark:text-text-muted">Configure input/output variables for data passing</div>
        </div>

        <div className="space-y-3">
          {workflow.steps.length === 0 && (
            <div className="text-center py-10 bg-white dark:bg-background-card border-2 border-dashed border-gray-200 dark:border-border rounded-2xl">
              <Zap className="w-8 h-8 text-gray-400 dark:text-text-muted mx-auto mb-2" />
              <p className="text-gray-500 dark:text-text-muted text-sm">Add tools below to build your workflow</p>
            </div>
          )}

          {workflow.steps.map((step, idx) => {
            const tool = tools.find((t) => t.id === step.toolId);
            if (!tool) return null;
            const IconComp = tool.icon ? (LucideIcons[tool.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>) : null;
            const isExpanded = expandedStep === step.id;

            return (
              <motion.div key={step.id} layout className="bg-white dark:bg-background-card border-2 border-gray-200 dark:border-border rounded-xl overflow-hidden">
                {/* Step Header */}
                <div className="flex items-center gap-3 p-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {IconComp ? <IconComp className="w-5 h-5 text-primary" /> : <Zap className="w-5 h-5 text-primary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-text-primary">{tool.name}</p>
                    <p className="text-xs text-gray-500 dark:text-text-muted">{tool.category}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => moveStep(idx, -1)} disabled={idx === 0} className="p-1.5 rounded text-gray-500 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary disabled:opacity-30 transition-colors">
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button onClick={() => moveStep(idx, 1)} disabled={idx === workflow.steps.length - 1} className="p-1.5 rounded text-gray-500 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary disabled:opacity-30 transition-colors">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button onClick={() => setExpandedStep(isExpanded ? null : step.id)} className={cn('p-1.5 rounded transition-colors', isExpanded ? 'text-primary bg-primary/10' : 'text-gray-500 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary')}>
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => removeStep(step.id)} className="p-1.5 rounded text-gray-500 dark:text-text-muted hover:text-red-500 dark:hover:text-red-400 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Configuration */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-gray-200 dark:border-border bg-gray-50 dark:bg-background-dark/50"
                    >
                      <div className="p-4 space-y-4">
                        {/* Instructions */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-text-secondary mb-1.5">Step Instructions</label>
                          <input
                            value={step.note || ''}
                            onChange={(e) => updateStep(step.id, { note: e.target.value })}
                            placeholder="What should the user do in this step?"
                            className="w-full px-3 py-2 bg-white dark:bg-background-card border-2 border-gray-200 dark:border-border rounded-lg text-sm text-gray-900 dark:text-text-primary focus:border-primary outline-none"
                          />
                        </div>

                        {/* Input Variable */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-text-secondary mb-1.5 flex items-center gap-1">
                            <ArrowRight className="w-3 h-3" /> Input Variable (from previous step)
                          </label>
                          <input
                            value={step.inputVar || ''}
                            onChange={(e) => updateStep(step.id, { inputVar: e.target.value })}
                            placeholder="e.g., {{script}} or {{step1}}"
                            className="w-full px-3 py-2 bg-white dark:bg-background-card border-2 border-gray-200 dark:border-border rounded-lg text-sm text-gray-900 dark:text-text-primary font-mono focus:border-primary outline-none"
                          />
                          <p className="text-xs text-gray-500 dark:text-text-muted mt-1">Use {"{{"}variableName{"}}"} to auto-fill from a previous step</p>
                        </div>

                        {/* Output Variable */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-text-secondary mb-1.5 flex items-center gap-1">
                            <PanelRight className="w-3 h-3" /> Output Variable Name
                          </label>
                          <input
                            value={step.outputVar || ''}
                            onChange={(e) => updateStep(step.id, { outputVar: e.target.value })}
                            placeholder="e.g., script, video, audio"
                            className="w-full px-3 py-2 bg-white dark:bg-background-card border-2 border-gray-200 dark:border-border rounded-lg text-sm text-gray-900 dark:text-text-primary font-mono focus:border-primary outline-none"
                          />
                          <p className="text-xs text-gray-500 dark:text-text-muted mt-1">Name to save this step&apos;s output for later steps</p>
                        </div>

                        {/* Auto-fill URL */}
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id={`autofill-${step.id}`}
                            checked={step.autoFillUrl || false}
                            onChange={(e) => updateStep(step.id, { autoFillUrl: e.target.checked })}
                            className="w-4 h-4 rounded border-gray-300 dark:border-border bg-white dark:bg-background-card text-primary focus:ring-primary"
                          />
                          <label htmlFor={`autofill-${step.id}`} className="text-sm text-gray-600 dark:text-text-secondary">
                            Auto-append input to URL as ?text= parameter
                          </label>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}

          {/* Add step button */}
          <div className="relative">
            <button
              onClick={() => setShowToolPicker(!showToolPicker)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-border rounded-xl text-gray-500 dark:text-text-muted hover:border-primary hover:text-primary transition-all duration-200"
            >
              <Plus className="w-4 h-4" /> Add Step
            </button>

            <AnimatePresence>
              {showToolPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute top-full mt-2 left-0 right-0 z-20 bg-white dark:bg-background-card border-2 border-gray-200 dark:border-border rounded-2xl shadow-2xl overflow-hidden"
                >
                  <div className="p-3 border-b border-gray-200 dark:border-border">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-text-muted" />
                      <input
                        autoFocus
                        value={toolSearch}
                        onChange={(e) => setToolSearch(e.target.value)}
                        placeholder="Search tools..."
                        className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-background-dark border border-gray-200 dark:border-border rounded-lg text-sm text-gray-900 dark:text-text-primary focus:border-primary outline-none"
                      />
                    </div>
                  </div>
                  <div className="max-h-56 overflow-y-auto p-2">
                    {filteredTools.length === 0 ? (
                      <p className="text-center py-4 text-gray-500 dark:text-text-muted text-sm">No tools found</p>
                    ) : (
                      filteredTools.map((tool) => {
                        const IconComp = tool.icon ? (LucideIcons[tool.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>) : null;
                        return (
                          <button
                            key={tool.id}
                            onClick={() => addStep(tool.id)}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-background-dark text-left transition-colors"
                          >
                            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              {IconComp ? <IconComp className="w-3.5 h-3.5 text-primary" /> : <Zap className="w-3.5 h-3.5 text-primary" />}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-text-primary">{tool.name}</p>
                              <p className="text-xs text-gray-500 dark:text-text-muted">{tool.category}</p>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

