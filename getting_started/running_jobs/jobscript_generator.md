# SLURM Jobscript Generator

<form>
  <div class="form-group">
    <label for="selectMachine">Cmputing system</label>
    <p class="help-block">Select the computing system on which you want to submit your job</p>
    <select class="form-control" id="selectMachine">
      <option>Daint Hybrid</option>
      <option>Daint MultiCore</option>
      <option>Leone</option>
      <option>Monch</option>
      <!-- <option>Tave</option> -->
    </select>
  </div>
  <div class="form-group">
    <label for="selectPartition">Partition</label>
    <p class="help-block">Select the partition on which you want to submit your job</p>
    <select class="form-control" id="selectPartition" >
    </select>
  </div>
 <div class="form-group" id="executableGroup">
    <label for="executable">Executable</label>
    <p class="help-block">Specify the executable of your application.</p>
    <input type="input" class="form-control" id="executable" placeholder="./executable.x" maxlength="75" onkeyup="return cscs_print_jobscript()">
  </div>
 <div class="form-group">
    <label for="jobName">Job Name</label>
    <p class="help-block">Specify a name for your job.</p>
    <input type="input" class="form-control" id="jobName" placeholder="job_name" maxlength="25" onkeyup="return cscs_print_jobscript()">
  </div>
 <div class="form-group">
    <label for="emailAddress">Email address</label>
    <p class="help-block">Specify your email address to get notified when the job changes state.</p>
    <input type="email" class="form-control" id="emailAddress" placeholder="Email" maxlength="75" onkeyup="return cscs_print_jobscript()">
  </div>
  <div class="row form-group">
    <div class="col-md-12">
    <label for="wallclock">Wall time</label>
    <p class="help-block">Specify the job duration.</p>
    </div>
    <div class="col-md-6">
      <p class="help-block">hours</p>
      <input type="number" class="form-control" id="hours" min="0" max="168" placeholder="0" value="1" onchange="return cscs_validate_hour() && cscs_print_jobscript()" onkeyup="return cscs_validate_hour() && cscs_print_jobscript()" onkeydown="return cscs_validate_hour() && cscs_print_jobscript()">
    </div>
    <div class="col-md-6">
      <p class="help-block">minutes</p>
      <input type="number" class="form-control" id="minutes" min="0" max="59" placeholder="0" onchange="return cscs_validate_minutes() && cscs_print_jobscript()" onkeyup="return cscs_validate_minutes() && cscs_print_jobscript()" onkeydown="return cscs_validate_minutes() && cscs_print_jobscript()">
    </div>
<!--
    <div class="col-md-4">
      <p class="help-block">seconds</p>
      <input type="number" class="form-control" id="seconds" min="0" max="59" placeholder="0" onchange="return cscs_validate_hour() && cscs_print_jobscript()" onkeyup="return cscs_validate_hour() && cscs_print_jobscript()">
    </div>
-->
  </div>
  <div class="form-group" id="ExclusiveNodeGroup">
    <label for="ExclusiveNode">Exclusive</label>
    <p class="help-block">Specify if you want to share your node.</p>
    <div class="checkbox">
      <label>
        <input type="checkbox" id="ExclusiveNode" onchange="cscs_print_jobscript()">Make nodes exclusive
      </label>
    </div>
  </div>
<!--
  <div class="form-group" id="hyperThreadingGroup">
    <label for="hyperThreading">Hyperthreading</label>
    <p class="help-block">Specify if you want to enable HyperThreading.</p>
    <div class="checkbox">
      <label>
        <input type="checkbox" id="hyperThreading" onchange="cscs_print_jobscript()">Enable hyperthreading
      </label>
    </div>
  </div>
 -->
  <div class="form-group" id="numberOfNodesGroup">
    <label for="numberOfNodes">Number of nodes</label>
    <p class="help-block">Specify the number of nodes.</p>
    <input type="number" class="form-control" id="numberOfNodes" min="1" value="1" onchange="return cscs_print_jobscript()">
  </div>
  <div class="form-group" id="numberTasksPerCoreGroup">
    <label for="numberTasksPerCore">Number of tasks per core</label>
    <p class="help-block">Specify the number of tasks per core. Values greater than one turn on hyperthreading.</p>
    <input type="number" class="form-control" id="numberTasksPerCore" min="1" max="4" value="1" onchange="return cscs_validate_num_tasks_per_core() && cscs_print_jobscript()" onkeyup="return cscs_validate_num_tasks_per_core() && cscs_print_jobscript()" onkeydown="return cscs_validate_num_tasks_per_core() && cscs_print_jobscript()">
  </div>
  <div class="form-group" id="numberOfTasksPerNodeGroup">
    <label for="numberOfTasksPerNode">Number of tasks per node</label>
    <p class="help-block">Specify the number of tasks per node, e.g. number of MPI ranks per node.</p>
    <input type="number" class="form-control" id="numberOfTasksPerNode" max="1000" min="1" value="1" onchange="return cscs_validate_num_tasks_per_node() && cscs_print_jobscript()" onkeyup="return cscs_validate_num_tasks_per_node() && cscs_print_jobscript()" onkeydown="return cscs_validate_num_tasks_per_node() && cscs_print_jobscript()">
  </div>
  <div class="form-group" id="numberOfCpusPerTaskGroup">
    <label for="numberOfCpusPerTask">Number of cpus per task</label>
    <p class="help-block">Specify the number of cups per task, e.g. number of OpenMP threads per MPI rank.</p>
    <input type="number" class="form-control" id="numberOfCpusPerTask" max="1000" min="1" value="1" onchange="return cscs_validate_num_cpus_per_task() && cscs_print_jobscript()" onkeyup="return cscs_validate_num_cpus_per_task() && cscs_print_jobscript()" onkeydown="return cscs_validate_num_cpus_per_task() && cscs_print_jobscript()">
  </div>
  <div class="form-group" id="bigMemoryGroup">
    <label for="bigMemory">Large memory nodes</label>
    <p class="help-block">Specify if you want to ask for nodes with a large amount of memory.</p>
    <div class="checkbox">
      <label>
        <input type="checkbox" id="bigMemory" onchange="return cscs_print_jobscript()">Large memory nodes
      </label>
    </div>
  </div>
  <!-- <a class="btn btn-primary" type="submit" id="submit_button" class="btn btn-default" href="#generated-script">Generate</a> -->
</form>

# Generated Script
<div class="form-group">
<div class="alert alert-info" role="alert" id="partitionwebsite"></div>
  <div class="alert alert-success" role="alert" id="jobscriptalert"></div>
  <textarea class="form-control" id="jobscript" rows="15" readonly style="resize:none"></textarea>
</div>
