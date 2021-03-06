"use strict";

var _cscs_split_time = function (timeString) {
    var hours = 0;
    var minutes = 0;
    var seconds = 0;

    var array = timeString.split(':');
    if(array.length == 3) {
        // assuming the case where we do not have the day
        hours = array[0];
        minutes = array[1];
        seconds = array[2];

    } else {
        return null;
    }

    return { 'hours' : hours, 'minutes' : minutes, 'seconds' : seconds };
};

var _cscs_compute_time_from_string = function (timeString) {
    var time = _cscs_split_time(timeString);

    if(time != null) {
        return Number(time.hours * 60.0) + Number(time.minutes);
    }
    return null;
};

var _cscs_compute_time = function (hours, minutes) {
    return Number(hours * 60.0) + Number(minutes);
};

var _cscs_compose_time = function (hours, minutes) {
    if(hours == null || hours == "undefined" || hours == "") {
        hours = 0;
    }
    if(minutes == null || minutes == "undefined" || minutes == "") {
        minutes = 0;
    }
    return _cscs_pad_interger(hours) + ":" + _cscs_pad_interger(minutes) + ":00";
};

var _cscs_pad_interger = function (number) {
    if (Number(number) < 10 && number != "00"
        && number != "00" && number != "01"
        && number != "02" && number != "03"
        && number != "04" && number != "05"
        && number != "06" && number != "07"
        && number != "08" && number != "09") {
        return "0" + number;
    }
    return number;
}

var _cscs_unpad_interger = function (number) {
    if (Number(number) < 10 && (number == "00"
        || number == "00" || number == "01"
        || number == "02" || number == "03"
        || number == "04" || number == "05"
        || number == "06" || number == "07"
        || number == "08" || number == "09")) {
        return number[1];
    }
    return number;
}

var _cscs_convert_time_string = function (timeString) {
    var time = _cscs_split_time(timeString);

    if(time != null) {
        return  _cscs_pad_interger(time.hours) + ":" + _cscs_pad_interger(time.minutes) + ":00";
    }
    return null;
};

var _cscs_is_element_hidden = function (element) {
    return $(element).is(":visible");
};

var _cscs_get_GUI_PropertyValue = function(element) {
    var object = $(element);
    var value = object.val();
    var isVisible = _cscs_is_element_hidden(object);

    if(isVisible == false) {
        return null;
    } 
    return value;
};

var _bindPrototypeMethods = function (child, parent) {
    child.prototype = Object.create(parent.prototype);
};

var Partition = function() {
    this.name = "partition";
    this.typeName = Partition;
    this.Partition = {
        "normal"  : "--partition=",
    };
    this.list_of_partitions = [ "normal" ];

    this.directive = "#SBATCH ";

    this.NumNodesDirective         = "--nodes=";
    this.NumGpusPerNodesDirective  = "--ntasks-per-node=";
    this.NumTasksPerNodesDirective = "--ntasks-per-node=";
    this.NumCpusPerTaskDirective   = "--cpus-per-task=";
    this.NumTasksPerCoreDirective  = "--ntask-per-core=";
    this.MemoryDirective           = "--mem=";
    this.EMailDirective            = "--mail-user=";
    this.NameDirective             = "--job-name=";
    this.ExclusiveDirective        = "--exclusive";
    this.WallTimeDirective         = "--time=";

    this.allow_node_sharing = {};

    this.allow_hyperthreading = {};

    this.partition_website = {};

    this.pre_commands = {};
    this.default_executable = {};

    this.has_constraints = {};

    this.max_num_nodes = {
        "normal"  : 1
    };
    this.max_num_gpus = {
        "normal"  : 1
    };
    this.max_num_tasks_per_node = {
        "normal"  : 1
    };
    this.max_num_cpus_per_tasks = {
        "normal"  : 1
    };
    this.max_num_tasks_per_core = {
        "normal"  : 1
    };
    this.max_memory_per_node = {
        "normal"  : 120
    };
    this.max_wall_time = {
        "normal"  : "00:00:00"
    };

    this.target_time = 0;

};

Partition.prototype.getValue = function(propertyName) {
    var value = propertyName[this.name];
    if (value == "undefined" || value == null ||  value == "") {
        return null;
    }
    return value;
};

Partition.prototype.hasHyperThreading = function() {
    var allow_hyperthreading = this.getValue(this.max_num_tasks_per_core);
    var has_hyperthreading = _cscs_get_GUI_PropertyValue('#numberTasksPerCore');
    if(has_hyperthreading == null) {
        has_hyperthreading = 1;
    }

    if(allow_hyperthreading != null && Number(allow_hyperthreading) > Number(1) && Number(has_hyperthreading) > Number(1)) {
        allow_hyperthreading = true;
    } else {
        allow_hyperthreading = false;
    }
    return allow_hyperthreading;
};

Partition.prototype.getMaxNumberOfThreads = function() {
    var has_hyperthreading = this.hasHyperThreading();

    var max_threads = this.getValue(this.max_num_tasks_per_node);
    var max_tasks_per_core = this.getValue(this.max_num_tasks_per_core);
    if(max_threads == null) {
        max_threads = 1;
    } else if(has_hyperthreading == true) {
        max_threads *= max_tasks_per_core;
    }
    return max_threads;
};

Partition.prototype.setNumTasksPerNodeAndNumCpusPerNodeValues = function (num_tasks_per_core) {
    // max tasks per node
    var tasks_per_node = this.getValue(this.max_num_tasks_per_node);
    if (tasks_per_node != null) {
        if (this.hasHyperThreading()) {
            tasks_per_node *= num_tasks_per_core;
        }
    } else {
        tasks_per_node = 1;
    }
    $('#numberOfTasksPerNode').val("max", tasks_per_node);
    $('#numberOfTasksPerNode').val(tasks_per_node);


    // max cpus per tasks
    var cpus_per_task = this.getValue(this.max_num_cpus_per_tasks);
    if (cpus_per_task != null) {
        cpus_per_task = Math.floor(this.getMaxNumberOfThreads() / tasks_per_node);
    } else {
        cpus_per_task = 1;
    }
    $('#numberOfCpusPerTask').val("max", cpus_per_task);
    $('#numberOfCpusPerTask').val(cpus_per_task);
}

Partition.prototype.updateNodesInformation = function () {
    // max tasks per core
    var tasks_per_core = this.getValue(this.max_num_tasks_per_core);
    if (tasks_per_core != null) {
        if (!this.hasHyperThreading()) {
            tasks_per_core = 1;
        }
    } else {
        tasks_per_core = 1;
    }
    $('#numberTasksPerCore').val("max", tasks_per_core);
    $('#numberTasksPerCore').val(tasks_per_core);

    this.setNumTasksPerNodeAndNumCpusPerNodeValues(tasks_per_core);
};

Partition.prototype.updateTimeGUI = function () {
    var target_time = this.getValue(this.max_wall_time);
    if (target_time == null) {
        $('#hours').val("0");
        $('#minutes').val("0");
        // $('#seconds').val("0");
    } else {
        var time = _cscs_split_time(target_time);
        $('#hours').val(_cscs_unpad_interger(time.hours));
        $('#minutes').val(_cscs_unpad_interger(time.minutes));
        // $('#seconds').val(time.seconds);
    }
};

Partition.prototype.hideGUIDataField = function(fieldid, fieldvalue) {
    var value = this.getValue(fieldvalue);
    if (value != null) {
        $(fieldid).show();
    } else {
        $(fieldid).hide();
    }
}

Partition.prototype.hideGUIBooleanField = function(fieldid, fieldvalue, referencevalue) {
    var value = this.getValue(fieldvalue);
    if (value != null && value == referencevalue) {
        $(fieldid).show();
    } else {
        $(fieldid).hide();
    }
}

Partition.prototype.updatePartitionsFields = function() {
    var _self = this;

    this.hideGUIBooleanField('#ExclusiveNodeGroup', this.allow_node_sharing, true);

    this.hideGUIDataField('#numberOfNodesGroup', this.max_num_nodes);
    this.hideGUIDataField('#numberTasksPerCoreGroup', this.max_num_tasks_per_core);
    this.hideGUIDataField('#numberOfTasksPerNodeGroup', this.max_num_tasks_per_node);
    this.hideGUIDataField('#numberOfCpusPerTaskGroup', this.max_num_cpus_per_tasks);
    this.hideGUIDataField('#bigMemoryGroup', this.max_memory_per_node);

    var value = this.getValue(this.default_executable);
    if (value == null) {
        $('#executableGroup').show();
    } else {
        $('#executableGroup').hide();
        $('#executable').val("");
    }
};

Partition.prototype.updatePartitionsInGUI = function() {
    var _self = this;

    for (var i = 0; i < _self.list_of_partitions.length; i++) {
        $('#selectPartition').append("<option>" + this.list_of_partitions[i] + "</option>");
    }

    $('#selectPartition').change(function(){
        // add here the changes when the partition changes
        __cscs_partition = new _self.typeName($(this).val());
        __cscs_partition.updatePartitionsFields();
        __cscs_partition.updateTimeGUI();
        __cscs_partition.updateNodesInformation();
        cscs_print_jobscript();
    });

    $('#numberTasksPerCore').change(function(){
        // add here the changes when the partition changes
        __cscs_partition.updateNodesInformation();
        cscs_print_jobscript();
    });

    __cscs_partition.updatePartitionsFields();
    __cscs_partition.updateTimeGUI();
    __cscs_partition.updateNodesInformation();
};

Partition.prototype.printPartition = function() {
    var value = this.getValue(this.Partition);
    if (value == null) {
        return "";
    }
    return this.directive + value + this.name + "\n";
};

Partition.prototype.printConstraints = function() {
    var value = this.getValue(this.has_constraints);
    if (value == null) {
        return "";
    }
    return this.directive + value + "\n";
};

Partition.prototype.printExclusive = function() {
    var value = $('#ExclusiveNode').prop("checked");
    var max = this.getValue(this.allow_node_sharing);
    if (max != null && value == true) {
        return this.directive + this.ExclusiveDirective + "\n";
    }
    return "";
};

Partition.prototype.printNumNodes = function() {
    var value = _cscs_get_GUI_PropertyValue('#numberOfNodes');
    if(value != null) {
        return this.directive + this.NumNodesDirective + value + "\n";        
    }
    return "";
};

Partition.prototype.printNumTasksPerCore = function() {
    var value = _cscs_get_GUI_PropertyValue('#numberTasksPerCore');
    if(value != null) {
        return this.directive + this.NumTasksPerCoreDirective + value + "\n";        
    }
    return "";
};

Partition.prototype.printNumTasksPerNodes = function() {
    var value = _cscs_get_GUI_PropertyValue('#numberOfTasksPerNode');
    if(value != null) {
        return this.directive + this.NumTasksPerNodesDirective + value + "\n";        
    }
    return "";
};

Partition.prototype.printNumCpusPerTask = function() {
    var value = _cscs_get_GUI_PropertyValue('#numberOfCpusPerTask');
    if(value != null) {
        return this.directive + this.NumCpusPerTaskDirective + value + "\n";        
    }
    return "";
};

Partition.prototype.printEnvironmentVariables = function() {
    var toPrint = "";
    toPrint += "export OMP_NUM_THREADS=$SLURM_CPUS_PER_TASK\n";        
    return toPrint;
};

Partition.prototype.getWallTime = function() {
    var hours = $('#hours').val();
    var minutes = $('#minutes').val();
    // var seconds = $('#seconds').val();

    var time        = _cscs_compute_time(hours, minutes);
    var time_string = _cscs_compose_time(hours, minutes);

    var max_time = this.getValue(this.max_wall_time);
    var max_time_string = _cscs_convert_time_string(max_time);
    var max_time_value = _cscs_compute_time_from_string(max_time);

    if (max_time != null && Number(time) > Number(max_time_value)) {
        time = max_time_value;
        time_string = max_time_string;
    } else if(max_time == null) {
        return "";
    }
    return this.directive + this.WallTimeDirective + time_string + "\n";
};

Partition.prototype.printMemPerNode = function() {
    var value = $('#bigMemory').prop("checked");
    var max = this.getValue(this.max_memory_per_node);
    if (max != null && value == true) {
        value = max;
    } else if(max == null || value == false) {
        return "";
    }
    return this.directive + this.MemoryDirective + value + "GB\n";
};

Partition.prototype.printExecutable = function() {
    var value = $('#executable').val();
    var max = this.getValue(this.default_executable);
    if (max != null && (value == "" || value == "undefined" || value == null)) {
        value = max;
    } else if (value == "" || value == "undefined" || value == null) {
        value = "./executable.x";
    }
    return "srun " + value;
};

Partition.prototype.printPreCommand = function() {
    var value = this.getValue(this.pre_commands);
    if (value != null && value != "" && value != "undefined") {
        return value + "\n";
    }
    return "";
};

Partition.prototype.printPartitionWebSite = function(element) {
    var website = this.getValue(this.partition_website);
    if(website != null) {
        element.innerHTML = "For more information about this queue, please refer to this <a target='_blank' href='" + website + "'>website</a>.";
    }
}


Partition.prototype.printJobScriptMessage = function(element) {
    var max_num_threads = this.getMaxNumberOfThreads();

    var current_num_threads = 1;
    var arrayOfNodeInfo = [];

    var num_tasks_per_core = _cscs_get_GUI_PropertyValue('#numberTasksPerCore');
    var num_tasks_per_node = _cscs_get_GUI_PropertyValue('#numberOfTasksPerNode');
    var num_cpus_per_task = _cscs_get_GUI_PropertyValue('#numberOfCpusPerTask');

    var has_hyperthreading = this.hasHyperThreading();


    if(num_tasks_per_core != null) {
        // current_num_threads *= num_tasks_per_core;
        arrayOfNodeInfo.push('tasks per core');
    }
    if(num_tasks_per_node != null) {
        current_num_threads *= num_tasks_per_node;
        arrayOfNodeInfo.push('tasks per node');
    }
    if(num_cpus_per_task != null) {
        current_num_threads *= num_cpus_per_task;
        arrayOfNodeInfo.push('cpus per task');
    }

    var warning_state = false;
    if(Number(current_num_threads) < Number(max_num_threads)) {
        warning_state = true;
    }
    element.innerHTML = null;

    if(warning_state) {
        var alertBox = $('#jobscriptalert');
        alertBox.show();
        if(alertBox.hasClass('alert-success') == true) {
            alertBox.removeClass('alert-success');    
        }
        alertBox.addClass('alert-warning');

        element.innerHTML += "<h4>Warning</h4>";
        element.innerHTML += "You have selected a ";
        if(Number(arrayOfNodeInfo.length) > 1) {
            element.innerHTML += "combination of ";
        } else {
            element.innerHTML += "number for ";
        }

        var counter = 0;
        var size = arrayOfNodeInfo.length;
        var x, y;
        for (x in arrayOfNodeInfo) {
            counter = Number(counter) + 1;
            element.innerHTML += '<b>' + arrayOfNodeInfo[x] + '</b>';
            
            if(counter == (size - 1)) {
                element.innerHTML += " and ";
            } else if(counter != size) {
                element.innerHTML += ", ";
            }
        }

        element.innerHTML += " that cannot achieve the maximum potential of the node.";
        element.innerHTML += " <p>The maximum parallel processes is <b>" + max_num_threads + "</b> but you have selected only <b>" + current_num_threads + "</b>.</p>";
    } else if (current_num_threads != 1){
        var alertBox = $('#jobscriptalert');
        alertBox.show();

        if(alertBox.hasClass('alert-warning') == true) {
            alertBox.removeClass('alert-warning');    
        }
        alertBox.addClass('alert-success');

        element.innerHTML += "<h4>Success</h4>";

        element.innerHTML += "<p>For a hybrid MPI + OpenMP program you have selected: </p>";
        element.innerHTML += "<p><b>" + num_tasks_per_node + "</b> MPI ranks and <b>" + num_cpus_per_task + "</b> OpenMP threads </p>";
    } else {
        var alertBox = $('#jobscriptalert');
        alertBox.hide();
    }
}

Partition.prototype.printJobScript = function(element) {
    element.innerHTML  = "#!/bin/bash -l\n";

    var jobname = $('#jobName').val();
    var placeholderJobName = $('#jobName').prop("placeholder");
    if (jobname != "undefined" && jobname != null && jobname != "") {
        element.innerHTML += this.directive + this.NameDirective + jobname + "\n";
    } else if (placeholderJobName != "undefined" && placeholderJobName != null && placeholderJobName != ""){
        element.innerHTML += this.directive + this.NameDirective + placeholderJobName + "\n";
    }

    var emailAddress = $('#emailAddress').val();
    if (emailAddress != "undefined" && emailAddress != null && emailAddress != "") {
        element.innerHTML += this.directive + this.EMailDirective + emailAddress + "\n";
    }

    element.innerHTML += this.getWallTime();

    element.innerHTML += this.printNumNodes();
    element.innerHTML += this.printNumTasksPerCore();
    element.innerHTML += this.printNumTasksPerNodes();
    element.innerHTML += this.printNumCpusPerTask();
    element.innerHTML += this.printMemPerNode();
    element.innerHTML += this.printPartition();
    element.innerHTML += this.printConstraints();
    element.innerHTML += this.printExclusive();

    element.innerHTML += "\n";
    element.innerHTML += this.printEnvironmentVariables();

    element.innerHTML += "\n";
    element.innerHTML += this.printPreCommand();
    element.innerHTML += this.printExecutable();
};

Partition.prototype.print = function(jobscript, partitionWebSite, jobscriptalert) {
    this.printPartitionWebSite(partitionWebSite);
    this.printJobScriptMessage(jobscriptalert);
    this.printJobScript(jobscript);
};

var DaintGPUPartition = function(name) {
    Partition.call(this);
    this.name = name;
    this.typeName = DaintGPUPartition;
    this.Partition = {
        "normal"  : "--partition=",
        "low"     : "--partition=",
        "high"    : "--partition=",
        "xfer"    : "--partition=",
        "prepost" : "--partition=",
        "debug"   : "--partition=",
    };

    this.max_wall_time = {
        "normal"  : "24:00:00",
        "low"     : "06:00:00",
        "high"    : "24:00:00",
        "xfer"    : "24:00:00",
        "prepost" : "00:30:00",
        "debug"   : "00:30:00"
    };

    this.partition_website = {
        "normal"  : "http://eth-cscs.github.io/getting_started/running_jobs/piz_daint",
        "low"     : "http://eth-cscs.github.io/getting_started/running_jobs/piz_daint",
        "high"    : "http://eth-cscs.github.io/getting_started/running_jobs/piz_daint",
        "xfer"    : "http://user.cscs.ch/storage/data_transfer/internal_transfer/index.html",
        "prepost" : "MISSING WEBSITE",
        "debug"   : "MISSING WEBSITE"
    };

    this.list_of_partitions = [ "normal", "low", "high", "xfer", "prepost", "debug" ];

    this.allow_node_sharing = {
        "normal" : false
    }

    this.pre_commands = {
        xfer : "module unload xalt",
    };

    this.default_executable = {
        xfer    : "rsync -av $1 $2\nif [ -n '$3' ]; then\n    sbatch --dependency=afterok:$SLURM_JOB_ID $3\nfi\n",
    };

    this.has_constraints = {
        "normal" : '--constraint=gpu',
        "low"    : '--constraint=gpu',
        "high"   : '--constraint=gpu',
        "debug"  : '--constraint=gpu',
    };

    this.max_num_nodes = {
        "normal" : 2400,
        "low"    : 2400,
        "high"   : 2400,
        "debug"  : 4
    };

    this.max_num_gpus = {
        "normal" : 1,
        "low"    : 1,
        "high"   : 1,
        "debug"  : 1
    };

    this.max_num_tasks_per_node = {
        "normal" : 12,
        "low"    : 12,
        "high"   : 12,
        "debug"  : 12
    };

    this.max_num_cpus_per_tasks = {
        "normal" : 12,
        "low"    : 12,
        "high"   : 12,
        "debug"  : 12
    };

    this.max_num_tasks_per_core = {
        "normal" : 2,
        "low"    : 2,
        "high"   : 2,
        "debug"  : 2
    };

    this.max_memory_per_node = {
        "normal"  : 120
    };
};
_bindPrototypeMethods(DaintGPUPartition, Partition);

var DaintMCPartition = function(name) {
    DaintGPUPartition.call(this);
    this.name = name;
    this.typeName = DaintMCPartition;

    this.has_constraints = {
        "normal" : '--constraint=mc',
        "low"    : '--constraint=mc',
        "high"   : '--constraint=mc',
        "debug"  : '--constraint=mc'
    };

    this.max_num_tasks_per_node = {
        "normal" : 36,
        "low"    : 36,
        "high"   : 36,
        "debug"  : 36
    };

    this.max_num_cpus_per_tasks = {
        "normal" : 36,
        "low"    : 36,
        "high"   : 36,
        "debug"  : 36
    };

};
_bindPrototypeMethods(DaintMCPartition, DaintGPUPartition);

var MonchPartition = function(name) {
    Partition.call(this);
    this.name = name;
    this.typeName = MonchPartition;
    this.Partition = {
        normal   : "--partition=",
        largemem : "--partition="
    };
    this.list_of_partitions = [ "normal", "largemem" ];
};
_bindPrototypeMethods(MonchPartition, Partition);

var LeonePartition = function(name) {
    Partition.call(this);
    this.name = name;
    this.typeName = LeonePartition;
    this.Partition = {
        normal   : "--partition=",
        largemem : "--partition="
    };
    this.list_of_partitions = [ "normal", "debug", "longrun" ];
};
_bindPrototypeMethods(LeonePartition, Partition);

var TavePartition = function(name) {
    Partition.call(this);
    this.name = name;
    this.typeName = TavePartition;
    this.Partition = {
        normal   : "--partition=",
        largemem : "--partition="
    };
    this.list_of_partitions = [ "normal", "largemem" ];

    this.max_num_tasks_per_core = {
        "normal"   : 4,
        "largemem" : 4
    };

};
_bindPrototypeMethods(TavePartition, Partition);


var __cscs_partition = {};

function _cscs_clean_fields() {
    document.getElementById("selectPartition").innerHTML = null;
    document.getElementById("jobscript").innerHTML = null;
}

function cscs_populate_form() {
    __cscs_partition = new DaintGPUPartition("normal");
    __cscs_partition.updatePartitionsInGUI();
    cscs_print_jobscript();

    $("#selectMachine").change(function(){
        if ($(this).val() == "Daint Hybrid") {
            _cscs_clean_fields();
            __cscs_partition = new DaintGPUPartition("normal");
            __cscs_partition.updatePartitionsInGUI();
            cscs_print_jobscript();
        } else if ($(this).val() == "Daint MultiCore") {
            _cscs_clean_fields();
            __cscs_partition = new DaintMCPartition("normal");
            __cscs_partition.updatePartitionsInGUI();
            cscs_print_jobscript();
        } else if ($(this).val() == "Monch") {
            _cscs_clean_fields();
            __cscs_partition = new MonchPartition("normal");
            __cscs_partition.updatePartitionsInGUI();
            cscs_print_jobscript();
        } else if ($(this).val() == "Leone") {
            _cscs_clean_fields();
            __cscs_partition = new LeonePartition("normal");
            __cscs_partition.updatePartitionsInGUI();
            cscs_print_jobscript();
        } else if ($(this).val() == "Tave") {
            _cscs_clean_fields();
            __cscs_partition = new TavePartition("normal");
            __cscs_partition.updatePartitionsInGUI();
            cscs_print_jobscript();
        }
    });

    $("#submit_button").click(function() {
      cscs_print_jobscript();
    });
}

function cscs_print_jobscript() {
    document.getElementById("jobscript").innerHTML = null;
    $('#jobscriptalert').hide();
    __cscs_partition.print(document.getElementById("jobscript"), document.getElementById("partitionwebsite"), document.getElementById("jobscriptalert"));
    return true;
}

function cscs_validate_hour() {
    var hours = $('#hours').val();
    var minutes = $('#minutes').val();

    var time = _cscs_compute_time(hours, minutes);

    var max_time = __cscs_partition.getValue(__cscs_partition.max_wall_time);
    var max_time_value = _cscs_compute_time_from_string(max_time);

    if (max_time != null && Number(time) > Number(max_time_value)) {
        var h = _cscs_split_time(max_time);

        time = _cscs_compute_time(h.hours, minutes);
        if(Number(time) > Number(max_time_value)) {
            $('#hours').val("max", _cscs_unpad_interger(h.hours));
            $('#hours').val(_cscs_unpad_interger(h.hours - 1));
        } else {
            $('#hours').val("max", _cscs_unpad_interger(h.hours));
            $('#hours').val(_cscs_unpad_interger(h.hours));
        }
    }
    return true;
}

function cscs_validate_minutes() {
    var hours = $('#hours').val();
    var minutes = $('#minutes').val();

    var time = _cscs_compute_time(hours, minutes);

    var max_time = __cscs_partition.getValue(__cscs_partition.max_wall_time);
    var max_time_value = _cscs_compute_time_from_string(max_time);

    if (max_time != null && Number(time) > Number(max_time_value)) {
        var h = _cscs_split_time(max_time);
        $('#minutes').val("max", _cscs_unpad_interger(h.minutes));
        $('#minutes').val(_cscs_unpad_interger(h.minutes));
    }
    return true;
}

function cscs_validate_num_tasks_per_core() {
    var obj = $('#numberTasksPerCore');
    var num_tasks_per_core = obj.val();
    var has_hyperthreading = __cscs_partition.hasHyperThreading();

    if (has_hyperthreading == false) {
        obj.val("max", 1);
        obj.val(1);
        __cscs_partition.setNumTasksPerNodeAndNumCpusPerNodeValues(1);
    } else {
        var value = __cscs_partition.getValue(__cscs_partition.max_num_tasks_per_core);
        if (Number(num_tasks_per_core) > Number(value)) {
            obj.val("max", value);
            obj.val(value);
            __cscs_partition.setNumTasksPerNodeAndNumCpusPerNodeValues(value);
        }
    }
    return true;
}

function cscs_validate_num_tasks_per_node() {
    var obj = $('#numberOfTasksPerNode');
    var num_tasks_per_node = _cscs_get_GUI_PropertyValue('#numberOfTasksPerNode');
    var max_threads = __cscs_partition.getMaxNumberOfThreads();
    var num_cpus_per_task = _cscs_get_GUI_PropertyValue('#numberOfCpusPerTask');

    if(num_cpus_per_task == null) {
        num_cpus_per_task = 1;
    }

    var value_allowed_at_this_point = Math.floor(Number(max_threads) / Number(num_cpus_per_task));
    if (Number(num_tasks_per_node) > Number(value_allowed_at_this_point)) {
        obj.val("max", value_allowed_at_this_point);
        obj.val(value_allowed_at_this_point);
    }
    return true;
}

function cscs_validate_num_cpus_per_task() {
    var obj = $('#numberOfCpusPerTask');
    var num_cpus_per_task = _cscs_get_GUI_PropertyValue('#numberOfCpusPerTask');
    var max_threads = __cscs_partition.getMaxNumberOfThreads();
    var num_tasks_per_node = _cscs_get_GUI_PropertyValue('#numberOfTasksPerNode');

    if(num_tasks_per_node == null) {
        num_tasks_per_node = 1;
    }

    var value_allowed_at_this_point = Math.floor(Number(max_threads) / Number(num_tasks_per_node));
    if (Number(num_cpus_per_task) > Number(value_allowed_at_this_point)) {
        obj.val("max", value_allowed_at_this_point);
        obj.val(value_allowed_at_this_point);
    }
    return true;
}

